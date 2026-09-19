import { useState, useEffect, useCallback, useId } from 'react';
import { UserPlus, KeyRound, Trash2, Loader2, Eye, EyeOff, X } from 'lucide-react';
import { apiClient } from '../api/config';
import { formatDate } from '../utils/dateFormatter';

// --- OUTILS ---

const inputClass =
  'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition';

const primaryButtonClass =
  'bg-imardos-blue hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors';

// Extrait un message lisible d'une erreur axios (validation Laravel, message du serveur, panne réseau)
const getErrorMessage = (error, fallback) => {
  if (!error.response) return 'Impossible de joindre le serveur. Vérifiez votre connexion internet.';
  const { data } = error.response;
  const firstFieldError = data?.errors ? Object.values(data.errors).flat()[0] : null;
  return firstFieldError || data?.message || fallback;
};

// Mêmes règles que le serveur, pour répondre immédiatement sans attendre le réseau
const validatePasswords = (password, confirmation) => {
  if (password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères.';
  if (password !== confirmation) return 'La confirmation ne correspond pas au mot de passe.';
  return null;
};

// --- PETITS COMPOSANTS ---

const Card = ({ title, description, children }) => (
  <section className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
    <h3 className="text-lg font-bold text-imardos-blue">{title}</h3>
    {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    <div className="mt-5">{children}</div>
  </section>
);

const Feedback = ({ feedback }) => {
  if (!feedback) return null;
  const isError = feedback.type === 'error';
  return (
    <p
      role={isError ? 'alert' : 'status'}
      className={`text-sm rounded-lg px-3 py-2 ${isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}
    >
      {feedback.text}
    </p>
  );
};

const TextField = ({ label, type = 'text', ...props }) => {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input id={id} type={type} className={inputClass} {...props} />
    </div>
  );
};

const PasswordField = ({ label, hint, ...props }) => {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input id={id} type={visible ? 'text' : 'password'} className={`${inputClass} pr-11`} {...props} />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-imardos-blue rounded-r-lg focus-visible:outline-2 focus-visible:outline-imardos-orange"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
};

const Modal = ({ title, onClose, children }) => {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
        >
          <X size={24} />
        </button>
        <h3 className="text-xl font-bold text-imardos-blue mb-6 pr-8">{title}</h3>
        {children}
      </div>
    </div>
  );
};

// --- MON PROFIL ---

const ProfileCard = ({ user, onUserUpdate }) => {
  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '' });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const unchanged = form.name === user?.name && form.email === user?.email;

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const { data } = await apiClient.put('/account/profile', form);
      onUserUpdate(data.user);
      setFeedback({ type: 'success', text: 'Profil mis à jour.' });
    } catch (error) {
      setFeedback({ type: 'error', text: getErrorMessage(error, 'Impossible de mettre à jour le profil.') });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Mon profil" description="Le nom et l'email associés à votre compte.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField label="Nom" name="name" value={form.name} onChange={handleChange} autoComplete="name" required />
        <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" required />
        <Feedback feedback={feedback} />
        <button type="submit" disabled={saving || unchanged} className={`${primaryButtonClass} w-full`}>
          {saving ? <><Loader2 className="animate-spin" size={18} /> Enregistrement...</> : 'Enregistrer le profil'}
        </button>
      </form>
    </Card>
  );
};

// --- MON MOT DE PASSE ---

const PasswordCard = () => {
  const emptyForm = { current_password: '', password: '', password_confirmation: '' };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    const problem = validatePasswords(form.password, form.password_confirmation);
    if (problem) {
      setFeedback({ type: 'error', text: problem });
      return;
    }

    setSaving(true);
    try {
      await apiClient.put('/account/password', form);
      setForm(emptyForm);
      setFeedback({
        type: 'success',
        text: 'Mot de passe modifié. Vos autres appareils ont été déconnectés.',
      });
    } catch (error) {
      setFeedback({ type: 'error', text: getErrorMessage(error, 'Impossible de modifier le mot de passe.') });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Mon mot de passe" description="Pour changer votre mot de passe, confirmez d'abord l'actuel.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordField label="Mot de passe actuel" name="current_password" value={form.current_password} onChange={handleChange} autoComplete="current-password" required />
        <PasswordField label="Nouveau mot de passe" hint="8 caractères minimum." name="password" value={form.password} onChange={handleChange} autoComplete="new-password" required />
        <PasswordField label="Confirmer le nouveau mot de passe" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} autoComplete="new-password" required />
        <Feedback feedback={feedback} />
        <button type="submit" disabled={saving} className={`${primaryButtonClass} w-full`}>
          {saving ? <><Loader2 className="animate-spin" size={18} /> Enregistrement...</> : 'Changer le mot de passe'}
        </button>
      </form>
    </Card>
  );
};

// --- ADMINISTRATEURS ---

const CreateAdminModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    const problem = validatePasswords(form.password, form.password_confirmation);
    if (problem) {
      setFeedback({ type: 'error', text: problem });
      return;
    }

    setSaving(true);
    try {
      const { data } = await apiClient.post('/admins', form);
      onCreated(data.admin);
    } catch (error) {
      setFeedback({ type: 'error', text: getErrorMessage(error, "Impossible d'ajouter cet administrateur.") });
      setSaving(false);
    }
  };

  return (
    <Modal title="Ajouter un administrateur" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField label="Nom" name="name" value={form.name} onChange={handleChange} autoComplete="off" required autoFocus />
        <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} autoComplete="off" required />
        <PasswordField label="Mot de passe" hint="8 caractères minimum. La personne pourra le changer depuis ses paramètres." name="password" value={form.password} onChange={handleChange} autoComplete="new-password" required />
        <PasswordField label="Confirmer le mot de passe" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} autoComplete="new-password" required />
        <Feedback feedback={feedback} />
        <button type="submit" disabled={saving} className={`${primaryButtonClass} w-full`}>
          {saving ? <><Loader2 className="animate-spin" size={18} /> Création...</> : "Ajouter l'administrateur"}
        </button>
      </form>
    </Modal>
  );
};

const ResetPasswordModal = ({ admin, onClose, onDone }) => {
  const [form, setForm] = useState({ password: '', password_confirmation: '' });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    const problem = validatePasswords(form.password, form.password_confirmation);
    if (problem) {
      setFeedback({ type: 'error', text: problem });
      return;
    }

    setSaving(true);
    try {
      await apiClient.put(`/admins/${admin.id}/password`, form);
      onDone(admin);
    } catch (error) {
      setFeedback({ type: 'error', text: getErrorMessage(error, 'Impossible de réinitialiser le mot de passe.') });
      setSaving(false);
    }
  };

  return (
    <Modal title={`Réinitialiser le mot de passe de ${admin.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600">
          {admin.name} sera déconnecté(e) de tous ses appareils et devra utiliser ce nouveau mot de passe.
        </p>
        <PasswordField label="Nouveau mot de passe" hint="8 caractères minimum." name="password" value={form.password} onChange={handleChange} autoComplete="new-password" required autoFocus />
        <PasswordField label="Confirmer le mot de passe" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} autoComplete="new-password" required />
        <Feedback feedback={feedback} />
        <button type="submit" disabled={saving} className={`${primaryButtonClass} w-full`}>
          {saving ? <><Loader2 className="animate-spin" size={18} /> Enregistrement...</> : 'Réinitialiser le mot de passe'}
        </button>
      </form>
    </Modal>
  );
};

const AdminsCard = ({ currentUser }) => {
  const [admins, setAdmins] = useState(null); // null = chargement en cours
  const [loadError, setLoadError] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [modal, setModal] = useState(null); // null | { type: 'create' } | { type: 'reset', admin }

  const loadAdmins = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/admins');
      setAdmins(data);
      setLoadError('');
    } catch (error) {
      setLoadError(getErrorMessage(error, "Impossible de charger la liste des administrateurs."));
    }
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const closeModal = useCallback(() => setModal(null), []);

  const handleCreated = (admin) => {
    setModal(null);
    setFeedback({ type: 'success', text: `${admin.name} a été ajouté(e) comme administrateur.` });
    loadAdmins();
  };

  const handlePasswordReset = (admin) => {
    setModal(null);
    setFeedback({ type: 'success', text: `Le mot de passe de ${admin.name} a été réinitialisé.` });
  };

  const handleDelete = async (admin) => {
    if (!window.confirm(`Supprimer le compte de ${admin.name} ? Cette personne ne pourra plus se connecter.`)) return;
    setFeedback(null);
    try {
      await apiClient.delete(`/admins/${admin.id}`);
      setFeedback({ type: 'success', text: `Le compte de ${admin.name} a été supprimé.` });
      loadAdmins();
    } catch (error) {
      setFeedback({ type: 'error', text: getErrorMessage(error, 'Impossible de supprimer ce compte.') });
    }
  };

  return (
    <Card title="Administrateurs" description="Les personnes qui peuvent se connecter à cet espace.">
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => { setFeedback(null); setModal({ type: 'create' }); }}
          className="bg-imardos-orange hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md"
        >
          <UserPlus size={18} /> Ajouter un administrateur
        </button>
      </div>

      {feedback && <div className="mb-4"><Feedback feedback={feedback} /></div>}

      {loadError ? (
        <div className="text-center py-8">
          <p role="alert" className="text-sm text-red-700 mb-3">{loadError}</p>
          <button type="button" onClick={loadAdmins} className="text-sm font-medium text-imardos-blue hover:underline">Réessayer</button>
        </div>
      ) : admins === null ? (
        <div className="text-center py-8" role="status">
          <Loader2 className="animate-spin text-imardos-blue mx-auto" size={28} aria-hidden="true" />
          <span className="sr-only">Chargement des administrateurs…</span>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
          {admins.map((admin) => {
            const isSelf = admin.id === currentUser?.id;
            return (
              <li key={admin.id} className="flex items-center gap-4 px-4 py-3">
                <div
                  aria-hidden="true"
                  className="w-10 h-10 shrink-0 rounded-full bg-imardos-light-blue text-imardos-blue font-bold flex items-center justify-center"
                >
                  {admin.name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">
                    {admin.name}
                    {isSelf && <span className="ml-2 text-xs font-medium text-imardos-blue bg-imardos-light-blue px-2 py-0.5 rounded-full">Vous</span>}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{admin.email}</p>
                  <p className="text-xs text-gray-400">Ajouté le {formatDate(admin.created_at)}</p>
                </div>
                {!isSelf && (
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => { setFeedback(null); setModal({ type: 'reset', admin }); }}
                      aria-label={`Réinitialiser le mot de passe de ${admin.name}`}
                      title="Réinitialiser le mot de passe"
                      className="text-imardos-blue hover:bg-imardos-light-blue p-2 rounded-lg transition-colors"
                    >
                      <KeyRound size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(admin)}
                      aria-label={`Supprimer le compte de ${admin.name}`}
                      title="Supprimer le compte"
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {modal?.type === 'create' && <CreateAdminModal onClose={closeModal} onCreated={handleCreated} />}
      {modal?.type === 'reset' && <ResetPasswordModal admin={modal.admin} onClose={closeModal} onDone={handlePasswordReset} />}
    </Card>
  );
};

// --- PAGE PARAMÈTRES ---

const AdminSettings = ({ user, onUserUpdate }) => (
  <div>
    <div className="mb-6 pb-4 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-imardos-blue">Paramètres</h2>
      <p className="text-sm text-gray-500 mt-1">
        Gérez votre compte et les personnes qui ont accès à l'administration.
      </p>
    </div>

    <div className="grid gap-6 xl:grid-cols-5 items-start">
      <div className="xl:col-span-2 space-y-6">
        <ProfileCard user={user} onUserUpdate={onUserUpdate} />
        <PasswordCard />
      </div>
      <div className="xl:col-span-3">
        <AdminsCard currentUser={user} />
      </div>
    </div>
  </div>
);

export default AdminSettings;
