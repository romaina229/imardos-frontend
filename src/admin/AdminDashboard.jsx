import { useState, useEffect } from 'react';
import { Plus, FileText, Phone, Edit, Trash2, LogOut, X, Loader2, Briefcase, Calendar, Image as ImageIcon, MessageSquare, HeartHandshake, PenLine, FolderOpen, Check } from 'lucide-react';
import { apiClient } from '../api/config';
import { formatDate } from '../utils/dateFormatter';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('actions');

  // États des données
  const [actions, setActions] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [jobResults, setJobResults] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);

  // État du formulaire
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalTab, setModalTab] = useState('');
  const [contacts, setContacts] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- CHARGEMENT DES DONNÉES ---
  const fetchData = async (tab) => {
    setLoading(true);
    try {
      let res;
      if (tab === 'actions') { res = await apiClient.get('/actions'); setActions(res.data); }
      else if (tab === 'jobs') { res = await apiClient.get('/jobse'); setJobs(res.data); }
      else if (tab === 'events') { res = await apiClient.get('/events'); setEvents(res.data); }
      else if (tab === 'gallery') { res = await apiClient.get('/galleries'); setGallery(res.data); }
      else if (tab === 'job-results') { res = await apiClient.get('/job-results'); setJobResults(res.data); }
      else if (tab === 'blogs') { res = await apiClient.get('/blogs'); setBlogs(res.data); }
      else if (tab === 'contacts') { res = await apiClient.get('/contacts'); setContacts(res.data);}
      else if (tab === 'resources') { res = await apiClient.get('/resources'); setResources(res.data); }
    } catch (error) {
      console.error("Erreur de chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  // --- MODALE ---
  const openCreateModal = (tab) => {
    setModalTab(tab); setEditingItem(null); setFormData({}); setIsModalOpen(true);
  };
  const openEditModal = (tab, item) => {
    setModalTab(tab); setEditingItem(item); setFormData(item); setIsModalOpen(true);
  };

  // --- CRUD VERS LARAVEL ---
    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Nettoyer les données pour les modules qui ont un champ image
      let cleanData = { ...formData };

      if (modalTab === 'actions' || modalTab === 'gallery' || modalTab === 'blogs') {
        // Si le champ image est une chaîne vide ou seulement des espaces, on le transforme en null
        cleanData.image = (cleanData.image && cleanData.image.trim() !== '') ? cleanData.image.trim() : null;
      }

      // 2. Exécution des requêtes CRUD
      if (modalTab === 'actions') {
        if (editingItem) await apiClient.put(`/actions/${editingItem.id}`, cleanData);
        else await apiClient.post('/actions', cleanData);
      } else if (modalTab === 'jobs') {
        if (editingItem) await apiClient.put(`/jobse/${editingItem.id}`, formData);
        else await apiClient.post('/jobse', formData);
      } else if (modalTab === 'events') {
        if (editingItem) await apiClient.put(`/events/${editingItem.id}`, formData);
        else await apiClient.post('/events', formData);
      } else if (modalTab === 'gallery') {
        if (editingItem) await apiClient.put(`/galleries/${editingItem.id}`, cleanData);
        else await apiClient.post('/galleries', cleanData);
      } else if (modalTab === 'job-results') {
        if (editingItem) await apiClient.put(`/job-results/${editingItem.id}`, formData);
        else await apiClient.post('/job-results', formData);
      } else if (modalTab === 'blogs') {
        if (editingItem) await apiClient.put(`/blogs/${editingItem.id}`, cleanData);
        else await apiClient.post('/blogs', cleanData);
      } else if (modalTab === 'resources') {
        if (editingItem) await apiClient.put(`/resources/${editingItem.id}`, formData);
        else await apiClient.post('/resources', formData);
      }
      
      setIsModalOpen(false);
      fetchData(modalTab);
      alert("Opération réussie !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (tab, id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet élément ?")) return;
    try {
      if (tab === 'actions') await apiClient.delete(`/actions/${id}`);
      else if (tab === 'jobs') await apiClient.delete(`/jobse/${id}`);
      else if (tab === 'events') await apiClient.delete(`/events/${id}`);
      else if (tab === 'gallery') await apiClient.delete(`/galleries/${id}`);
      else if (tab === 'job-results') await apiClient.delete(`/job-results/${id}`);
      else if (tab === 'blogs') await apiClient.delete(`/blogs/${id}`);
      else if (tab === 'resources') await apiClient.delete(`/resources/${id}`);
      fetchData(tab);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression");
    }
  };

  const handleMarkAsRead = async (item) => {
    try {
      await apiClient.put(`/contacts/${item.id}`);
      // On recharge la liste pour voir le changement
      fetchData('contacts');
    } catch (error) {
      //console.error("Erreur lors du marquage", error);
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm("Voulez-vous supprimer ce message ?")) return;
    try {
      await apiClient.delete(`/contacts/${id}`);
      fetchData('contacts');
    } catch (error) {
      //console.error("Erreur lors de la suppression", error);
    }
  };

  // --- RENDER DES ONGLETS ---
  const renderTabContent = () => {
    switch(activeTab) {
      case 'actions': return <TabContent title="Nos actions" data={actions} columns={['Image','Titre','Catégorie','Localisation','Statut']} keys={['image','title','category','location','status']} isGallery onAdd={() => openCreateModal('actions')} onEdit={(item) => openEditModal('actions', item)} onDelete={(id) => handleDelete('actions', id)} />;
      case 'jobs': return <TabContent title="Offres d'emploi" data={jobs} columns={['Titre','Département','Type','Date limite','Résultats']} keys={['title','department','type','deadline','results']} onAdd={() => openCreateModal('jobs')} onEdit={(item) => openEditModal('jobs', item)} onDelete={(id) => handleDelete('jobs', id)} />;
      case 'events': return <TabContent title="Évènements" data={events} columns={['Titre','Lieu','Date','Type']} keys={['title','location','date','type']} onAdd={() => openCreateModal('events')} onEdit={(item) => openEditModal('events', item)} onDelete={(id) => handleDelete('events', id)} />;
      case 'gallery': return <TabContent title="Galerie photos" data={gallery} columns={['Image','Titre','Catégorie']} keys={['image','title','category']} isGallery onAdd={() => openCreateModal('gallery')} onEdit={(item) => openEditModal('gallery', item)} onDelete={(id) => handleDelete('gallery', id)} />;
      case 'job-results': return (<TabContent title="Résultats des offres" data={jobResults} columns={['Titre', 'Offre (Job)', 'Contenu des résultats', 'Statut']} keys={['name', 'job_title', 'result_content', 'status']} onAdd={() => openCreateModal('job-results')} onEdit={(item) => openEditModal('job-results', item)} onDelete={(id) => handleDelete('job-results', id)} />);
      case 'blogs': return <TabContent title="Blog" data={blogs} columns={['Image','Titre','Catégorie','Auteur']} keys={['image','title','category','author']} isGallery onAdd={() => openCreateModal('blogs')} onEdit={(item) => openEditModal('blogs', item)} onDelete={(id) => handleDelete('blogs', id)} />;
      case 'contacts': return (<TabContent title="Messages reçus" data={contacts} columns={['Nom', 'Email', 'Sujet', 'Message', 'Statut', 'Reçu le']} keys={['name', 'email', 'subject', 'message', 'is_read', 'created_at']} formatDateColumn="created_at" isContactTab={true} onAdd={null} onEdit={(item) => handleMarkAsRead(item)} onDelete={(id) => handleDeleteContact(id)} />);
      case 'resources': return (<TabContent title="Ressources et documents" data={resources} columns={['Titre', 'Catégorie', 'Description', 'Taille', 'Lien']} keys={['title', 'category', 'description', 'file_size', 'file_url']} onAdd={() => openCreateModal('resources')} onEdit={(item) => openEditModal('resources', item)} onDelete={(id) => handleDelete('resources', id)} />);
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-imardos-blue text-white px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <h1 className="text-xl font-bold">Tableau de bord IMARDOS</h1>
        <button onClick={onLogout} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-sm"><LogOut size={18} /> Déconnexion</button>
      </div>

      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-[72px] z-40">
        <div className="container mx-auto px-4 flex overflow-x-auto">
          <TabButton icon={<HeartHandshake size={18} />} label="Nos actions" tab="actions" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton icon={<Briefcase size={18} />} label="Offres d'emploi" tab="jobs" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton icon={<Calendar size={18} />} label="Évènements" tab="events" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton icon={<ImageIcon size={18} />} label="Galerie" tab="gallery" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton icon={<FileText size={18} />} label="Résultats des offres" tab="job-results" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton icon={<PenLine size={18} />} label="Blog" tab="blogs" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton icon={<FolderOpen size={18} />} label="Ressources" tab="resources" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton icon={<Phone size={18} />} label="Messages contact" tab="contacts" activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? <div className="text-center py-12"><Loader2 className="animate-spin text-imardos-blue mx-auto mb-2" size={32} /><p className="text-gray-500">Chargement depuis la base de données...</p></div> : renderTabContent()}
      </div>

      {/* MODALE DE FORMULAIRE UNIQUE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"><X size={24} /></button>
            <h3 className="text-2xl font-bold text-imardos-blue mb-6">{editingItem ? `Modifier ${getLabel(modalTab)}` : `Ajouter ${getLabel(modalTab)}`}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* CHAMPS NOS ACTIONS */}
              {modalTab === 'actions' && (
                <>
                  <Input label="Titre" name="title" value={formData.title} onChange={handleChange} required />
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label><select name="category" value={formData.category || ''} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition"><option value="">Sélectionner</option><option value="Santé">Santé</option><option value="Éducation">Éducation</option><option value="Autonomisation">Autonomisation</option><option value="Protection">Protection</option><option value="DSSR">DSSR</option><option value="Développement">Développement</option></select></div>
                    <Input label="Localisation" name="location" value={formData.location} onChange={handleChange} required />
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea name="description" value={formData.description || ''} onChange={handleChange} rows="3" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition resize-none"></textarea></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Statut</label><select name="status" value={formData.status || 'En cours'} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition"><option value="En cours">En cours</option><option value="Terminé">Terminé</option><option value="À venir">À venir</option></select></div>
                    <Input label="Lien de l'image (URL)" name="image" value={formData.image} onChange={handleChange} />
                  </div>
                </>
              )}

              {/* CHAMPS OFFRES D'EMPLOI */}
              {modalTab === 'jobs' && (
                <><Input label="Titre du poste" name="title" value={formData.title} onChange={handleChange} required /><div className="grid grid-cols-2 gap-4"><Input label="Département" name="department" value={formData.department} onChange={handleChange} required /><Input label="Type" name="type" value={formData.type} onChange={handleChange} required /></div><Input label="Date limite" name="deadline" value={formData.deadline} onChange={handleChange} required />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Résultats de l'étude des dossiers</label>
                    <textarea name="results" value={formData.results || ''} onChange={handleChange} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition resize-none" placeholder="Ex: 3 candidats retenus. 12 dossiers non conformes."></textarea>
                  </div>
                </>
              )}

              {/* CHAMPS ÉVÈNEMENTS */}
              {modalTab === 'events' && (
                <><Input label="Titre" name="title" value={formData.title} onChange={handleChange} required /><Input label="Lieu" name="location" value={formData.location} onChange={handleChange} required /><div className="grid grid-cols-2 gap-4"><Input label="Date" name="date" type="date" value={formData.date} onChange={handleChange} required /><Input label="Type" name="type" value={formData.type} onChange={handleChange} required /></div></>
              )}

              {/* CHAMPS GALERIE */}
              {modalTab === 'gallery' && (
                <><Input label="Titre" name="title" value={formData.title} onChange={handleChange} required /><Input label="Catégorie" name="category" value={formData.category} onChange={handleChange} required /><Input label="Lien de l'image (URL)" name="image" value={formData.image} onChange={handleChange} required /></>
              )}

              {/* CHAMPS BLOG */}
              {modalTab === 'blogs' && (
                <><Input label="Titre de l'article" name="title" value={formData.title} onChange={handleChange} required /><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label><select name="category" value={formData.category || 'Actualités'} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition"><option value="Actualités">Actualités</option><option value="Articles">Articles</option><option value="Communiqués">Communiqués</option></select></div><Input label="Auteur" name="author" value={formData.author} onChange={handleChange} required /></div><Input label="Date (ex: 15 Septembre 2024)" name="date" value={formData.date} onChange={handleChange} required /><Input label="Lien de l'image (URL)" name="image" value={formData.image} onChange={handleChange} /><div><label className="block text-sm font-medium text-gray-700 mb-1">Résumé (Excerpt)</label><textarea name="excerpt" value={formData.excerpt || ''} onChange={handleChange} rows="2" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition resize-none"></textarea></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Contenu (HTML autorisé)</label><textarea name="content" value={formData.content || ''} onChange={handleChange} rows="4" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition resize-none"></textarea></div></>
              )}

              {/* CHAMPS RESSOURCES */}
              {modalTab === 'resources' && (
                <>
                  <Input label="Titre du document" name="title" value={formData.title} onChange={handleChange} required />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Catégorie (ex: Rapport annuel)" name="category" value={formData.category} onChange={handleChange} required />
                    <Input label="Taille du fichier (ex: 2.4 Mo)" name="file_size" value={formData.file_size} onChange={handleChange} />
                  </div>
                  <Input label="Lien de téléchargement (URL du PDF)" name="file_url" value={formData.file_url} onChange={handleChange} required />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (optionnel)</label>
                    <textarea name="description" value={formData.description || ''} onChange={handleChange} rows="2" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition resize-none"></textarea>
                  </div>
                </>
              )}

              {/* CHAMPS AVIS (LIÉS AUX OFFRES D'EMPLOI) */}
              {modalTab === 'job-results' && (
                <>
                  <Input label="Nom de l'auteur" name="name" value={formData.name} onChange={handleChange} required />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Offre d'emploi concernée (Job Title)</label>
                    <input type="text" name="job_title" value={formData.job_title || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition" placeholder="Ex: Chargé(e) de Projet Santé" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Note (1 à 5)</label>
                    <select name="rating" value={formData.rating || 5} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition">{ [1,2,3,4,5].map(r => <option key={r} value={r}>{r} étoiles</option>) }</select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire sur le recrutement</label>
                    <textarea name="comment" value={formData.comment || ''} onChange={handleChange} rows="3" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut de modération</label>
                    <select name="status" value={formData.status || 'En attente'} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition"><option value="En attente">En attente</option><option value="Publié">Publié</option><option value="Rejeté">Rejeté</option></select>
                  </div>
                </>
              )}

              {modalTab === 'job-results' && (
                <>
                  <Input label="Titre du résultat (ex: Recrutement 2024)" name="name" value={formData.name} onChange={handleChange} required />
                  <Input label="Offre concernée (ex: Chargé de projet)" name="job_title" value={formData.job_title} onChange={handleChange} required />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contenu des résultats (Liste, texte, etc.)</label>
                    <textarea name="result_content" value={formData.result_content || ''} onChange={handleChange} rows="6" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition resize-none" placeholder="Ex: 3 candidats retenus : A, B, C. 12 dossiers non conformes."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut de publication</label>
                    <select name="status" value={formData.status || 'En attente'} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition">
                      <option value="En attente">En attente (Brouillon)</option>
                      <option value="Publié">Publié (Visible sur le site)</option>
                    </select>
                  </div>
                </>
              )}

              <button type="submit" disabled={isSubmitting} className="w-full bg-imardos-blue hover:bg-blue-800 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">{isSubmitting ? <><Loader2 className="animate-spin" size={20} /> Enregistrement...</> : (editingItem ? 'Mettre à jour' : 'Créer')}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SOUS-COMPOSANTS ---
const TabButton = ({ icon, label, tab, activeTab, setActiveTab }) => (
  <button onClick={() => setActiveTab(tab)} className={`flex items-center gap-2 px-6 py-4 border-b-4 font-medium text-sm transition-all whitespace-nowrap ${activeTab === tab ? 'border-imardos-orange text-imardos-blue bg-imardos-light-blue/30' : 'border-transparent text-gray-500 hover:text-imardos-blue hover:bg-gray-50'}`}>{icon} {label}</button>
);
const Input = ({ label, name, required, type = 'text', value, onChange }) => (
  <div><label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && '*'}</label><input type={type} name={name} value={value || ''} onChange={onChange} required={required} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition" /></div>
);
const TabContent = ({ title, data, columns, keys, isGallery = false, formatDateColumn=null, onAdd, onEdit, onDelete }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-imardos-blue">{title}</h2>
      {onAdd && ( <button onClick={onAdd} className="bg-imardos-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md"><Plus size={18} /> Ajouter</button> )}
    </div>
    {data.length === 0 ? <div className="text-center py-12 bg-white rounded-xl shadow-sm text-gray-500">Aucun élément trouvé dans la base de données.</div> : 
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm font-medium">
            <tr>
              {columns.map((col, i) => <th key={i} className="px-6 py-4">{col}</th>)}
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                {keys.map((key, i) => {
                const value = (formatDateColumn && key === formatDateColumn) 
                  ? formatDate(item[key]) 
                  : item[key];
                return <td key={i} className="px-6 py-4 text-sm text-gray-700">
                  {isGallery && key === 'image' ? <img src={item[key]} alt="Thumb" className="w-12 h-12 object-cover rounded-md border border-gray-200" /> : (key === 'is_read' ? (item[key] ? <span className="text-green-600 font-medium">Lu</span> : <span className="text-imardos-orange font-medium">Non lu</span>) : value )}
                </td>
              })}
                <td className="px-6 py-4 flex justify-end gap-2">
                  {onEdit && ( <button onClick={() => onEdit(item)} className="text-imardos-blue hover:text-blue-800 p-1"><Edit size={18} /></button> )}
                  {onDelete && ( <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18} /></button> )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    }
  </div>
);
const getLabel = (tab) => { if (tab === 'actions') return "une action"; if (tab === 'jobs') return "une offre d'emploi"; if (tab === 'events') return "un évènement"; if (tab === 'gallery') return "une photo"; if (tab === 'job-results') return "un avis"; if (tab === 'blogs') return "un article de blog"; return "un élément"; if (tab === 'resources') return "une ressource"; };

export default AdminDashboard;