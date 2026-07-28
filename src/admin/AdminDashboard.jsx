import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, LogOut, X, Loader2 } from 'lucide-react';
import { apiClient } from '../api/config';

const AdminDashboard = ({ onLogout }) => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  
  // État du formulaire
  const [formData, setFormData] = useState({
    title: '', category: '', location: '', description: '', status: 'En cours'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. READ : Charger les actions
  const fetchActions = async () => {
    setLoading(true);
    try {
      const query = `{ allActions { id title category location description status } }`;
      const response = await apiClient.post('', { query });
      setActions(response.data.data.allActions);
    } catch (error) {
      console.error("Erreur chargement admin:", error);
      alert("Erreur de chargement des données. Vérifiez votre token API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  // Gestion du formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setEditingAction(null);
    setFormData({ title: '', category: '', location: '', description: '', status: 'En cours' });
    setIsModalOpen(true);
  };

  const openEditModal = (action) => {
    setEditingAction(action);
    setFormData({ 
      title: action.title, category: action.category, 
      location: action.location, description: action.description, 
      status: action.status 
    });
    setIsModalOpen(true);
  };

  // 2. CREATE & 3. UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mutation GraphQL pour créer ou mettre à jour
    const mutation = editingAction 
      ? `
        mutation UpdateAction($id: ItemId!, $title: String!, $category: String!, $location: String!, $description: String!, $status: String!) {
          updateAction(id: $id, data: { title: $title, category: $category, location: $location, description: $description, status: $status }) {
            id title
          }
        }
      `
      : `
        mutation CreateAction($title: String!, $category: String!, $location: String!, $description: String!, $status: String!) {
          createAction(data: { title: $title, category: $category, location: $location, description: $description, status: $status }) {
            id title
          }
        }
      `;

    const variables = editingAction 
      ? { id: editingAction.id, ...formData }
      : { ...formData };

    try {
      await apiClient.post('', { query: mutation, variables });
      alert(editingAction ? "Action modifiée avec succès !" : "Action créée avec succès !");
      setIsModalOpen(false);
      fetchActions(); // Recharger la liste
    } catch (error) {
      console.error("Erreur CRUD:", error);
      alert("Erreur lors de l'enregistrement. Vérifiez votre modèle DatoCMS.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer définitivement cette action ?")) return;

    const mutation = `
      mutation DeleteAction($id: ItemId!) {
        deleteAction(id: $id) { id }
      }
    `;

    try {
      await apiClient.post('', { query: mutation, variables: { id } });
      alert("Action supprimée avec succès !");
      fetchActions();
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre supérieure Admin */}
      <div className="bg-imardos-blue text-white px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <h1 className="text-xl font-bold">Tableau de bord IMARDOS</h1>
        <div className="flex items-center gap-6">
          <span className="text-sm text-imardos-light-blue">Admin</span>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-imardos-blue">Gestion des Actions</h2>
          <button 
            onClick={openCreateModal}
            className="bg-imardos-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md"
          >
            <Plus size={18} /> Ajouter une action
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 flex flex-col items-center">
            <Loader2 className="animate-spin text-imardos-blue mb-2" size={32} />
            <p className="text-gray-500">Chargement des actions...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {actions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Aucune action n'a encore été créée. Cliquez sur "Ajouter une action" pour commencer.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-600 text-sm font-medium">
                  <tr>
                    <th className="px-6 py-4">Titre</th>
                    <th className="px-6 py-4">Catégorie</th>
                    <th className="px-6 py-4">Localisation</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {actions.map((action) => (
                    <tr key={action.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{action.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{action.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{action.location}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium
                          ${action.status === 'En cours' ? 'bg-imardos-orange/20 text-imardos-orange' : 
                            action.status === 'Terminé' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {action.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex justify-end gap-2">
                        <button onClick={() => openEditModal(action)} className="text-imardos-blue hover:text-blue-800 p-1 transition-colors">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(action.id)} className="text-red-500 hover:text-red-700 p-1 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* MODALE DE FORMULAIRE (CREATE & UPDATE) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-bold text-imardos-blue mb-6">
              {editingAction ? 'Modifier l\'action' : 'Ajouter une nouvelle action'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition" 
                  placeholder="Ex: Projet Santé Maternelle"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Santé">Santé</option>
                    <option value="Éducation">Éducation</option>
                    <option value="Autonomisation">Autonomisation</option>
                    <option value="Protection">Protection</option>
                    <option value="DSSR">DSSR</option>
                    <option value="Développement">Développement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localisation *</label>
                  <input 
                    type="text" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition" 
                    placeholder="Ex: Département du Mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition resize-none" 
                  placeholder="Décrivez brièvement l'action..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition"
                >
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                  <option value="À venir">À venir</option>
                </select>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-imardos-blue hover:bg-blue-800 text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Enregistrement...
                    </>
                  ) : (
                    editingAction ? 'Mettre à jour l\'action' : 'Créer l\'action'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;