import { useState } from 'react';
import { Heart, CreditCard, Smartphone, CheckCircle, Loader2 } from 'lucide-react';
import { apiClient } from '../api/config';

const Donate = () => {
  const [formData, setFormData] = useState({
    amount: '',
    donor_name: '',
    donor_email: '',
    phone: '',
    payment_method: 'kkiapay' // Par défaut
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Montants prédéfinis comme sur un plugin Give
  const predefinedAmounts = [1000, 2500, 5000, 10000];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Veuillez entrer un montant valide.');
      return;
    }

    setLoading(true);
    try {
      // 1. Enregistrer le don dans Laravel (statut 'pending')
      const response = await apiClient.post('/donations', {
        ...formData,
        amount: parseFloat(formData.amount),
        status: 'pending'
      });

      // 2. SIMULATION DE REDIRECTION VERS LA PASSERELLE DE PAIEMENT
      // ---> Ici, vous intégrerez plus tard votre code Fedapay / Kkiapay
      console.log('Don ID:', response.data.id);
      
      // Simulation de succès après 2 secondes
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        // Normalement, ici vous redirigez l'utilisateur vers la page de paiement
        // window.location.href = 'https://paiement.kkiapay.me/...';
      }, 2000);

    } catch (error) {
      console.error(error);
      alert('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-imardos-blue mb-4">Faire un don</h1>
          <div className="w-24 h-1 bg-imardos-orange mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-xl mx-auto">
            Votre générosité nous aide à poursuivre nos actions sur le terrain. Chaque don compte.
          </p>
        </div>

        {success ? (
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center border border-green-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-imardos-blue mb-2">Merci pour votre don !</h2>
            <p className="text-gray-600 mb-6">Votre contribution a bien été enregistrée. Ensemble, nous construisons un avenir meilleur.</p>
            <button onClick={() => window.location.reload()} className="bg-imardos-blue hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Retour à l'accueil
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
              
              {/* SECTION CHOIX DU MONTANT */}
              <div>
                <label className="block text-sm font-bold text-imardos-blue mb-3">Montant du don (XOF)</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {predefinedAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setFormData({ ...formData, amount: amt.toString() })}
                      className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                        parseFloat(formData.amount) === amt 
                        ? 'border-imardos-orange bg-imardos-orange/10 text-imardos-orange' 
                        : 'border-gray-200 text-gray-600 hover:border-imardos-blue hover:bg-gray-50'
                      }`}
                    >
                      {amt.toLocaleString()} XOF
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">XOF</span>
                  <input 
                    type="number" 
                    name="amount" 
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Montant personnalisé"
                    className="w-full pl-16 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition text-lg"
                    required
                  />
                </div>
              </div>

              {/* SECTION INFORMATIONS DU DONATEUR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Votre nom</label>
                  <input type="text" name="donor_name" value={formData.donor_name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="donor_email" value={formData.donor_email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone (Pour Mobile Money)</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-imardos-orange outline-none transition" />
                </div>
              </div>

              {/* SECTION MOYEN DE PAIEMENT */}
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-bold text-imardos-blue mb-3">Moyen de paiement</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <PaymentOption label="Kkiapay" value="kkiapay" icon={<CreditCard size={20} />} selected={formData.payment_method} onChange={(val) => setFormData({...formData, payment_method: val})} />
                  <PaymentOption label="Fedapay" value="fedapay" icon={<CreditCard size={20} />} selected={formData.payment_method} onChange={(val) => setFormData({...formData, payment_method: val})} />
                  <PaymentOption label="Orange Money" value="orange_money" icon={<Smartphone size={20} />} selected={formData.payment_method} onChange={(val) => setFormData({...formData, payment_method: val})} />
                  <PaymentOption label="Moov Money" value="moov_money" icon={<Smartphone size={20} />} selected={formData.payment_method} onChange={(val) => setFormData({...formData, payment_method: val})} />
                </div>
              </div>

              {/* BOUTON DE DON */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-imardos-orange hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={24} /> Traitement du paiement...</>
                ) : (
                  <><Heart size={24} /> Faire un don de {formData.amount ? parseFloat(formData.amount).toLocaleString() : '...'} XOF</>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// Sous-composant pour les options de paiement
const PaymentOption = ({ label, value, icon, selected, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(value)}
    className={`flex flex-col items-center justify-center gap-2 py-4 rounded-lg border-2 transition-all ${
      selected === value ? 'border-imardos-orange bg-imardos-orange/10 text-imardos-orange' : 'border-gray-200 text-gray-500 hover:border-imardos-blue hover:bg-gray-50'
    }`}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

export default Donate;