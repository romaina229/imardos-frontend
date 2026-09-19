import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, FileText, Mail, Edit, Trash2, LogOut, X, Loader2, Briefcase, Calendar, Image as ImageIcon, HeartHandshake, PenLine, FolderOpen, Menu, Settings as SettingsIcon, ExternalLink } from 'lucide-react';
import { apiClient } from '../api/config';
import { formatDate } from '../utils/dateFormatter';
import { supabase } from '../api/lib/supabase';
import AdminSettings from './AdminSettings';

// Image de secours affichée quand l'URL enregistrée est cassée ou inaccessible
const PLACEHOLDER_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Cpath d='M60 130 L85 100 L105 122 L135 85 L150 130 Z' fill='%23d1d5db'/%3E%3Ccircle cx='75' cy='80' r='12' fill='%23d1d5db'/%3E%3C/svg%3E";

// --- NAVIGATION DE LA BARRE LATÉRALE ---
const NAV_GROUPS = [
  {
    label: 'Contenu du site',
    items: [
      { tab: 'actions', label: 'Nos actions', icon: HeartHandshake },
      { tab: 'events', label: 'Évènements', icon: Calendar },
      { tab: 'gallery', label: 'Galerie', icon: ImageIcon },
      { tab: 'blogs', label: 'Blog', icon: PenLine },
      { tab: 'resources', label: 'Ressources', icon: FolderOpen },
    ],
  },
  {
    label: 'Recrutement',
    items: [
      { tab: 'jobs', label: "Offres d'emploi", icon: Briefcase },
      { tab: 'job-results', label: 'Résultats des offres', icon: FileText },
    ],
  },
  {
    label: 'Communication',
    items: [{ tab: 'contacts', label: 'Messages contact', icon: Mail }],
  },
  {
    label: 'Administration',
    items: [{ tab: 'settings', label: 'Paramètres', icon: SettingsIcon }],
  },
];
const NAV_ITEMS = NAV_GROUPS.flatMap((group) => group.items);
const DEFAULT_TAB = 'actions';

const AdminDashboard = ({ user, onLogout, onUserUpdate }) => {
  // La section active est conservée dans l'URL (/admin?section=blogs) :
  // après un rechargement de page, on revient exactement là où on était.
  const [searchParams] = useSearchParams();
  const sectionParam = searchParams.get('section');
  const activeTab = NAV_ITEMS.some((item) => item.tab === sectionParam) ? sectionParam : DEFAULT_TAB;
  const currentItem = NAV_ITEMS.find((item) => item.tab === activeTab);

  // Barre latérale : tiroir sur mobile, toujours visible sur grand écran
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  const [galleryImageFile, setGalleryImageFile] = useState(null);
  const [galleryImagePreview, setGalleryImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalTab, setModalTab] = useState('');
  const [contacts, setContacts] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleGalleryImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide.');
      return;
    }

    if (galleryImagePreview) URL.revokeObjectURL(galleryImagePreview);

    const previewUrl = URL.createObjectURL(file);
    setGalleryImageFile(file);
    setGalleryImagePreview(previewUrl);
    setFormData((prev) => ({ ...prev, image: previewUrl }));
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
    // « Paramètres » charge ses propres données
    if (activeTab !== 'settings') fetchData(activeTab);
  }, [activeTab]);

  // Échap ferme le tiroir de navigation sur mobile
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen]);

  // --- MODALE ---
  const openCreateModal = (tab) => {
    setModalTab(tab); setEditingItem(null);setGalleryImageFile(null); setGalleryImagePreview(''); setFormData({}); setIsModalOpen(true);
  };
  const openEditModal = (tab, item) => {
    setModalTab(tab); setEditingItem(item); setGalleryImageFile(null); setGalleryImagePreview('');setFormData(item); setIsModalOpen(true);
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

      // Upload de l'image pour la galerie, les actions et le blog si un fichier a été sélectionné
      if ((modalTab === 'gallery' || modalTab === 'actions' || modalTab === 'blogs') && galleryImageFile) {
        if (!supabase) {
          throw new Error('Les variables VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY sont absentes. Configurez Supabase avant d’envoyer une image.');
        }

        const fileExt = galleryImageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        // utiliser un dossier distinct par type pour faciliter l'organisation
        const folder = modalTab === 'gallery' ? 'gallery' : modalTab === 'actions' ? 'actions' : 'blogs';
        const filePath = `${folder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, galleryImageFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        cleanData.image = publicUrlData.publicUrl;
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
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Fond assombri derrière le tiroir (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      {/* BARRE LATÉRALE */}
      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-imardos-blue text-white flex flex-col shadow-xl transition-[transform,visibility] duration-200 motion-reduce:transition-none lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:visible lg:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full invisible'}`}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/15">
          <div className="h-10 w-10 shrink-0 rounded-full bg-imardos-light-blue overflow-hidden">
            <img src="/files/IMARDOS-logo-principal.png" alt="" className="h-full w-full object-cover scale-110" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold leading-tight">IMARDOS</p>
            <p className="text-xs text-white/70">Administration</p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fermer le menu"
            className="lg:hidden p-1 rounded-lg hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-imardos-orange"
          >
            <X size={22} />
          </button>
        </div>

        <nav aria-label="Navigation de l'administration" className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1 text-xs font-medium text-white/70">{group.label}</p>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.tab}>
                    <SidebarLink item={item} isActive={activeTab === item.tab} onNavigate={() => setSidebarOpen(false)} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/15 p-4 space-y-3">
          <div className="flex items-center gap-3 min-w-0">
            <div aria-hidden="true" className="h-9 w-9 shrink-0 rounded-full bg-white/15 flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-white/70 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors text-sm focus-visible:outline-2 focus-visible:outline-imardos-orange"
            >
              <ExternalLink size={16} aria-hidden="true" /> Voir le site
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors text-sm focus-visible:outline-2 focus-visible:outline-imardos-orange"
            >
              <LogOut size={16} aria-hidden="true" /> Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENU */}
      <div className="flex-1 min-w-0">
        {/* Barre du haut (mobile uniquement) : bouton de menu + section en cours */}
        <header className="lg:hidden sticky top-0 z-30 bg-imardos-blue text-white flex items-center gap-3 px-4 py-3 shadow-md">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={sidebarOpen}
            aria-controls="admin-sidebar"
            className="p-1 rounded-lg hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-imardos-orange"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold">{currentItem?.label}</span>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === 'settings' ? (
            <AdminSettings user={user} onUserUpdate={onUserUpdate} />
          ) : loading ? (
            <div className="text-center py-12"><Loader2 className="animate-spin text-imardos-blue mx-auto mb-2" size={32} /><p className="text-gray-500">Chargement depuis la base de données...</p></div>
          ) : (
            renderTabContent()
          )}
        </div>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select name="status" value={formData.status || 'En cours'} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition"><option value="En cours">En cours</option><option value="Terminé">Terminé</option><option value="À venir">À venir</option></select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image {!editingItem && '*'}
                    </label>

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleGalleryImageChange}
                      required={!editingItem}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-imardos-light-blue file:text-imardos-blue file:font-medium hover:file:bg-blue-100 cursor-pointer"
                    />

                    {galleryImagePreview && (<div className="mt-3"><p className="text-sm text-gray-500 mb-2">Aperçu :</p>
                        <img
                          src={galleryImagePreview}
                          alt="Aperçu"
                          className="w-full max-h-64 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}

                    {editingItem && !galleryImageFile && formData.image && (
                      <div className="mt-3"><p className="text-sm text-gray-500 mb-2">Image actuelle :</p>
                        <img src={formData.image} alt="Image actuelle" className="w-full max-h-64 object-cover rounded-lg border border-gray-200 bg-gray-100" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER_IMAGE; }}/>
                      </div>
                    )}
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
                <><Input label="Titre" name="title" value={formData.title} onChange={handleChange} required /><Input label="Catégorie" name="category" value={formData.category} onChange={handleChange} required /><div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image *
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleGalleryImageChange}
                  required={!editingItem}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-imardos-light-blue file:text-imardos-blue file:font-medium hover:file:bg-blue-100 cursor-pointer"
                />

                {galleryImagePreview && (<div className="mt-3"><p className="text-sm text-gray-500 mb-2">Aperçu :</p>
                    <img
                      src={galleryImagePreview}
                      alt="Aperçu"
                      className="w-full max-h-64 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                {editingItem && !galleryImageFile && formData.image && (
                  <div className="mt-3"><p className="text-sm text-gray-500 mb-2">Image actuelle :</p>
                    <img src={formData.image} alt="Image actuelle" className="w-full max-h-64 object-cover rounded-lg border border-gray-200 bg-gray-100" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER_IMAGE; }}/>
                  </div>
                )}
                </div></>
              )}

              {/* CHAMPS BLOG */}
              {modalTab === 'blogs' && (
                <><Input label="Titre de l'article" name="title" value={formData.title} onChange={handleChange} required /><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label><select name="category" value={formData.category || 'Actualités'} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition"><option value="Actualités">Actualités</option><option value="Articles">Articles</option><option value="Communiqués">Communiqués</option></select></div><Input label="Auteur" name="author" value={formData.author} onChange={handleChange} required /></div><Input label="Date (ex: 15 Septembre 2024)" name="date" value={formData.date} onChange={handleChange} required /><label className="block text-sm font-medium text-gray-700 mb-1">
                  Image *
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleGalleryImageChange}
                  required={!editingItem}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-imardos-light-blue file:text-imardos-blue file:font-medium hover:file:bg-blue-100 cursor-pointer"
                />

                {galleryImagePreview && (<div className="mt-3"><p className="text-sm text-gray-500 mb-2">Aperçu :</p>
                    <img
                      src={galleryImagePreview}
                      alt="Aperçu"
                      className="w-full max-h-64 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                {editingItem && !galleryImageFile && formData.image && (
                  <div className="mt-3"><p className="text-sm text-gray-500 mb-2">Image actuelle :</p>
                    <img src={formData.image} alt="Image actuelle" className="w-full max-h-64 object-cover rounded-lg border border-gray-200 bg-gray-100" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER_IMAGE; }}/>
                  </div>
                )}
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Résumé (Excerpt)</label><textarea name="excerpt" value={formData.excerpt || ''} onChange={handleChange} rows="2" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition resize-none"></textarea></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Contenu (HTML autorisé)</label><textarea name="content" value={formData.content || ''} onChange={handleChange} rows="4" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition resize-none"></textarea></div></>
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
const SidebarLink = ({ item, isActive, onNavigate }) => {
  const Icon = item.icon;
  return (
    <Link
      to={`/admin?section=${item.tab}`}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border-l-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-imardos-orange ${isActive ? 'bg-white/15 border-imardos-orange text-white' : 'border-transparent text-white/80 hover:bg-white/10 hover:text-white'}`}
    >
      <Icon size={18} aria-hidden="true" /> {item.label}
    </Link>
  );
};
const Input = ({ label, name, required, type = 'text', value, onChange }) => (
  <div><label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && '*'}</label><input type={type} name={name} value={value || ''} onChange={onChange} required={required} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition" /></div>
);
const TabContent = ({ title, data, columns, keys, isGallery = false, formatDateColumn=null, onAdd, onEdit, onDelete }) => (
  <div>
    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-imardos-blue">{title}</h2>
      {onAdd && ( <button onClick={onAdd} className="bg-imardos-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"><Plus size={18} /> Ajouter</button> )}
    </div>
    {data.length === 0 ? (
      <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400">
        <FolderOpen size={36} className="mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500">Aucun élément trouvé dans la base de données.</p>
      </div>
    ) : 
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide font-semibold border-b border-gray-200">
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
                  {isGallery && key === 'image' ? (
                    item[key] ? (
                      <img
                        src={item[key]}
                        alt="Thumb"
                        className="w-12 h-12 object-cover rounded-md border border-gray-200 bg-gray-100"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER_IMAGE; }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-md border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-300">
                        <ImageIcon size={18} />
                      </div>
                    )
                  ) : (key === 'is_read' ? (item[key] ? <span className="text-green-600 font-medium">Lu</span> : <span className="text-imardos-orange font-medium">Non lu</span>) : value )}
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
const getLabel = (tab) => { if (tab === 'actions') return "une action"; if (tab === 'jobs') return "une offre d'emploi"; if (tab === 'events') return "un évènement"; if (tab === 'gallery') return "une photo"; if (tab === 'job-results') return "un avis"; if (tab === 'blogs') return "un article de blog"; if (tab === 'resources') return "une ressource"; return "un élément"; };

export default AdminDashboard;