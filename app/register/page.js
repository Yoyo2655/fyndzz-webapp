'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// Liste complète des indicatifs téléphoniques
const PHONE_CODES = [
  { code: '+1', country: 'États-Unis / Canada', flag: '🇺🇸' },
  { code: '+7', country: 'Russie / Kazakhstan', flag: '🇷🇺' },
  { code: '+20', country: 'Égypte', flag: '🇪🇬' },
  { code: '+27', country: 'Afrique du Sud', flag: '🇿🇦' },
  { code: '+30', country: 'Grèce', flag: '🇬🇷' },
  { code: '+31', country: 'Pays-Bas', flag: '🇳🇱' },
  { code: '+32', country: 'Belgique', flag: '🇧🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+34', country: 'Espagne', flag: '🇪🇸' },
  { code: '+36', country: 'Hongrie', flag: '🇭🇺' },
  { code: '+39', country: 'Italie', flag: '🇮🇹' },
  { code: '+40', country: 'Roumanie', flag: '🇷🇴' },
  { code: '+41', country: 'Suisse', flag: '🇨🇭' },
  { code: '+43', country: 'Autriche', flag: '🇦🇹' },
  { code: '+44', country: 'Royaume-Uni', flag: '🇬🇧' },
  { code: '+45', country: 'Danemark', flag: '🇩🇰' },
  { code: '+46', country: 'Suède', flag: '🇸🇪' },
  { code: '+47', country: 'Norvège', flag: '🇳🇴' },
  { code: '+48', country: 'Pologne', flag: '🇵🇱' },
  { code: '+49', country: 'Allemagne', flag: '🇩🇪' },
  { code: '+51', country: 'Pérou', flag: '🇵🇪' },
  { code: '+52', country: 'Mexique', flag: '🇲🇽' },
  { code: '+53', country: 'Cuba', flag: '🇨🇺' },
  { code: '+54', country: 'Argentine', flag: '🇦🇷' },
  { code: '+55', country: 'Brésil', flag: '🇧🇷' },
  { code: '+56', country: 'Chili', flag: '🇨🇱' },
  { code: '+57', country: 'Colombie', flag: '🇨🇴' },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
  { code: '+60', country: 'Malaisie', flag: '🇲🇾' },
  { code: '+61', country: 'Australie', flag: '🇦🇺' },
  { code: '+62', country: 'Indonésie', flag: '🇮🇩' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭' },
  { code: '+64', country: 'Nouvelle-Zélande', flag: '🇳🇿' },
  { code: '+65', country: 'Singapour', flag: '🇸🇬' },
  { code: '+66', country: 'Thaïlande', flag: '🇹🇭' },
  { code: '+81', country: 'Japon', flag: '🇯🇵' },
  { code: '+82', country: 'Corée du Sud', flag: '🇰🇷' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
  { code: '+86', country: 'Chine', flag: '🇨🇳' },
  { code: '+90', country: 'Turquie', flag: '🇹🇷' },
  { code: '+91', country: 'Inde', flag: '🇮🇳' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '+93', country: 'Afghanistan', flag: '🇦🇫' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+95', country: 'Myanmar', flag: '🇲🇲' },
  { code: '+98', country: 'Iran', flag: '🇮🇷' },
  { code: '+212', country: 'Maroc', flag: '🇲🇦' },
  { code: '+213', country: 'Algérie', flag: '🇩🇿' },
  { code: '+216', country: 'Tunisie', flag: '🇹🇳' },
  { code: '+218', country: 'Libye', flag: '🇱🇾' },
  { code: '+220', country: 'Gambie', flag: '🇬🇲' },
  { code: '+221', country: 'Sénégal', flag: '🇸🇳' },
  { code: '+222', country: 'Mauritanie', flag: '🇲🇷' },
  { code: '+223', country: 'Mali', flag: '🇲🇱' },
  { code: '+224', country: 'Guinée', flag: '🇬🇳' },
  { code: '+225', country: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: '+226', country: 'Burkina Faso', flag: '🇧🇫' },
  { code: '+227', country: 'Niger', flag: '🇳🇪' },
  { code: '+228', country: 'Togo', flag: '🇹🇬' },
  { code: '+229', country: 'Bénin', flag: '🇧🇯' },
  { code: '+230', country: 'Maurice', flag: '🇲🇺' },
  { code: '+231', country: 'Libéria', flag: '🇱🇷' },
  { code: '+232', country: 'Sierra Leone', flag: '🇸🇱' },
  { code: '+233', country: 'Ghana', flag: '🇬🇭' },
  { code: '+234', country: 'Nigéria', flag: '🇳🇬' },
  { code: '+235', country: 'Tchad', flag: '🇹🇩' },
  { code: '+236', country: 'Centrafrique', flag: '🇨🇫' },
  { code: '+237', country: 'Cameroun', flag: '🇨🇲' },
  { code: '+238', country: 'Cabo Verde', flag: '🇨🇻' },
  { code: '+239', country: 'São Tomé-et-Príncipe', flag: '🇸🇹' },
  { code: '+240', country: 'Guinée équatoriale', flag: '🇬🇶' },
  { code: '+241', country: 'Gabon', flag: '🇬🇦' },
  { code: '+242', country: 'Congo', flag: '🇨🇬' },
  { code: '+243', country: 'RD Congo', flag: '🇨🇩' },
  { code: '+244', country: 'Angola', flag: '🇦🇴' },
  { code: '+245', country: 'Guinée-Bissau', flag: '🇬🇼' },
  { code: '+246', country: 'Diego Garcia', flag: '🇮🇴' },
  { code: '+248', country: 'Seychelles', flag: '🇸🇨' },
  { code: '+249', country: 'Soudan', flag: '🇸🇩' },
  { code: '+250', country: 'Rwanda', flag: '🇷🇼' },
  { code: '+251', country: 'Éthiopie', flag: '🇪🇹' },
  { code: '+252', country: 'Somalie', flag: '🇸🇴' },
  { code: '+253', country: 'Djibouti', flag: '🇩🇯' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+255', country: 'Tanzanie', flag: '🇹🇿' },
  { code: '+256', country: 'Ouganda', flag: '🇺🇬' },
  { code: '+257', country: 'Burundi', flag: '🇧🇮' },
  { code: '+258', country: 'Mozambique', flag: '🇲🇿' },
  { code: '+260', country: 'Zambie', flag: '🇿🇲' },
  { code: '+261', country: 'Madagascar', flag: '🇲🇬' },
  { code: '+262', country: 'Réunion / Mayotte', flag: '🇷🇪' },
  { code: '+263', country: 'Zimbabwe', flag: '🇿🇼' },
  { code: '+264', country: 'Namibie', flag: '🇳🇦' },
  { code: '+265', country: 'Malawi', flag: '🇲🇼' },
  { code: '+266', country: 'Lesotho', flag: '🇱🇸' },
  { code: '+267', country: 'Botswana', flag: '🇧🇼' },
  { code: '+268', country: 'Eswatini', flag: '🇸🇿' },
  { code: '+269', country: 'Comores', flag: '🇰🇲' },
  { code: '+290', country: 'Sainte-Hélène', flag: '🇸🇭' },
  { code: '+291', country: 'Érythrée', flag: '🇪🇷' },
  { code: '+297', country: 'Aruba', flag: '🇦🇼' },
  { code: '+298', country: 'Îles Féroé', flag: '🇫🇴' },
  { code: '+299', country: 'Groenland', flag: '🇬🇱' },
  { code: '+350', country: 'Gibraltar', flag: '🇬🇮' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+352', country: 'Luxembourg', flag: '🇱🇺' },
  { code: '+353', country: 'Irlande', flag: '🇮🇪' },
  { code: '+354', country: 'Islande', flag: '🇮🇸' },
  { code: '+355', country: 'Albanie', flag: '🇦🇱' },
  { code: '+356', country: 'Malte', flag: '🇲🇹' },
  { code: '+357', country: 'Chypre', flag: '🇨🇾' },
  { code: '+358', country: 'Finlande', flag: '🇫🇮' },
  { code: '+359', country: 'Bulgarie', flag: '🇧🇬' },
  { code: '+370', country: 'Lituanie', flag: '🇱🇹' },
  { code: '+371', country: 'Lettonie', flag: '🇱🇻' },
  { code: '+372', country: 'Estonie', flag: '🇪🇪' },
  { code: '+373', country: 'Moldavie', flag: '🇲🇩' },
  { code: '+374', country: 'Arménie', flag: '🇦🇲' },
  { code: '+375', country: 'Biélorussie', flag: '🇧🇾' },
  { code: '+376', country: 'Andorre', flag: '🇦🇩' },
  { code: '+377', country: 'Monaco', flag: '🇲🇨' },
  { code: '+378', country: 'Saint-Marin', flag: '🇸🇲' },
  { code: '+380', country: 'Ukraine', flag: '🇺🇦' },
  { code: '+381', country: 'Serbie', flag: '🇷🇸' },
  { code: '+382', country: 'Monténégro', flag: '🇲🇪' },
  { code: '+383', country: 'Kosovo', flag: '🇽🇰' },
  { code: '+385', country: 'Croatie', flag: '🇭🇷' },
  { code: '+386', country: 'Slovénie', flag: '🇸🇮' },
  { code: '+387', country: 'Bosnie-Herzégovine', flag: '🇧🇦' },
  { code: '+389', country: 'Macédoine du Nord', flag: '🇲🇰' },
  { code: '+420', country: 'République tchèque', flag: '🇨🇿' },
  { code: '+421', country: 'Slovaquie', flag: '🇸🇰' },
  { code: '+423', country: 'Liechtenstein', flag: '🇱🇮' },
  { code: '+500', country: 'Îles Malouines', flag: '🇫🇰' },
  { code: '+501', country: 'Belize', flag: '🇧🇿' },
  { code: '+502', country: 'Guatemala', flag: '🇬🇹' },
  { code: '+503', country: 'Salvador', flag: '🇸🇻' },
  { code: '+504', country: 'Honduras', flag: '🇭🇳' },
  { code: '+505', country: 'Nicaragua', flag: '🇳🇮' },
  { code: '+506', country: 'Costa Rica', flag: '🇨🇷' },
  { code: '+507', country: 'Panama', flag: '🇵🇦' },
  { code: '+508', country: 'Saint-Pierre-et-Miquelon', flag: '🇵🇲' },
  { code: '+509', country: 'Haïti', flag: '🇭🇹' },
  { code: '+590', country: 'Guadeloupe', flag: '🇬🇵' },
  { code: '+591', country: 'Bolivie', flag: '🇧🇴' },
  { code: '+592', country: 'Guyana', flag: '🇬🇾' },
  { code: '+593', country: 'Équateur', flag: '🇪🇨' },
  { code: '+594', country: 'Guyane française', flag: '🇬🇫' },
  { code: '+595', country: 'Paraguay', flag: '🇵🇾' },
  { code: '+596', country: 'Martinique', flag: '🇲🇶' },
  { code: '+597', country: 'Suriname', flag: '🇸🇷' },
  { code: '+598', country: 'Uruguay', flag: '🇺🇾' },
  { code: '+599', country: 'Antilles néerlandaises', flag: '🇧🇶' },
  { code: '+670', country: 'Timor oriental', flag: '🇹🇱' },
  { code: '+672', country: 'Antarctique', flag: '🇦🇶' },
  { code: '+673', country: 'Brunéi', flag: '🇧🇳' },
  { code: '+674', country: 'Nauru', flag: '🇳🇷' },
  { code: '+675', country: 'Papouasie-Nouvelle-Guinée', flag: '🇵🇬' },
  { code: '+676', country: 'Tonga', flag: '🇹🇴' },
  { code: '+677', country: 'Salomon', flag: '🇸🇧' },
  { code: '+678', country: 'Vanuatu', flag: '🇻🇺' },
  { code: '+679', country: 'Fidji', flag: '🇫🇯' },
  { code: '+680', country: 'Palaos', flag: '🇵🇼' },
  { code: '+682', country: 'Îles Cook', flag: '🇨🇰' },
  { code: '+683', country: 'Niue', flag: '🇳🇺' },
  { code: '+685', country: 'Samoa', flag: '🇼🇸' },
  { code: '+686', country: 'Kiribati', flag: '🇰🇮' },
  { code: '+687', country: 'Nouvelle-Calédonie', flag: '🇳🇨' },
  { code: '+688', country: 'Tuvalu', flag: '🇹🇻' },
  { code: '+689', country: 'Polynésie française', flag: '🇵🇫' },
  { code: '+690', country: 'Tokelau', flag: '🇹🇰' },
  { code: '+691', country: 'Micronésie', flag: '🇫🇲' },
  { code: '+692', country: 'Marshall', flag: '🇲🇭' },
  { code: '+850', country: 'Corée du Nord', flag: '🇰🇵' },
  { code: '+852', country: 'Hong Kong', flag: '🇭🇰' },
  { code: '+853', country: 'Macao', flag: '🇲🇴' },
  { code: '+855', country: 'Cambodge', flag: '🇰🇭' },
  { code: '+856', country: 'Laos', flag: '🇱🇦' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
  { code: '+886', country: 'Taïwan', flag: '🇹🇼' },
  { code: '+960', country: 'Maldives', flag: '🇲🇻' },
  { code: '+961', country: 'Liban', flag: '🇱🇧' },
  { code: '+962', country: 'Jordanie', flag: '🇯🇴' },
  { code: '+963', country: 'Syrie', flag: '🇸🇾' },
  { code: '+964', country: 'Irak', flag: '🇮🇶' },
  { code: '+965', country: 'Koweït', flag: '🇰🇼' },
  { code: '+966', country: 'Arabie Saoudite', flag: '🇸🇦' },
  { code: '+967', country: 'Yémen', flag: '🇾🇪' },
  { code: '+968', country: 'Oman', flag: '🇴🇲' },
  { code: '+970', country: 'Palestine', flag: '🇵🇸' },
  { code: '+971', country: 'Émirats Arabes Unis', flag: '🇦🇪' },
  { code: '+972', country: 'Israël', flag: '🇮🇱' },
  { code: '+973', country: 'Bahreïn', flag: '🇧🇭' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦' },
  { code: '+975', country: 'Bhoutan', flag: '🇧🇹' },
  { code: '+976', country: 'Mongolie', flag: '🇲🇳' },
  { code: '+977', country: 'Népal', flag: '🇳🇵' },
  { code: '+992', country: 'Tadjikistan', flag: '🇹🇯' },
  { code: '+993', country: 'Turkménistan', flag: '🇹🇲' },
  { code: '+994', country: 'Azerbaïdjan', flag: '🇦🇿' },
  { code: '+995', country: 'Géorgie', flag: '🇬🇪' },
  { code: '+996', country: 'Kirghizistan', flag: '🇰🇬' },
  { code: '+998', country: 'Ouzbékistan', flag: '🇺🇿' },
]

// Liste complète des pays
const COUNTRIES = [
  'Afghanistan', 'Afrique du Sud', 'Albanie', 'Algérie', 'Allemagne', 'Andorre', 'Angola',
  'Antigua-et-Barbuda', 'Arabie Saoudite', 'Argentine', 'Arménie', 'Australie', 'Autriche',
  'Azerbaïdjan', 'Bahamas', 'Bahreïn', 'Bangladesh', 'Barbade', 'Belgique', 'Belize',
  'Bénin', 'Bhoutan', 'Biélorussie', 'Birmanie', 'Bolivie', 'Bosnie-Herzégovine', 'Botswana',
  'Brésil', 'Brunéi', 'Bulgarie', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodge',
  'Cameroun', 'Canada', 'Centrafrique', 'Chili', 'Chine', 'Chypre', 'Colombie', 'Comores',
  'Congo', 'Corée du Nord', 'Corée du Sud', 'Costa Rica', 'Côte d\'Ivoire', 'Croatie', 'Cuba',
  'Danemark', 'Djibouti', 'Dominique', 'Égypte', 'Émirats Arabes Unis', 'Équateur', 'Érythrée',
  'Espagne', 'Eswatini', 'Estonie', 'États-Unis', 'Éthiopie', 'Fidji', 'Finlande', 'France',
  'Gabon', 'Gambie', 'Géorgie', 'Ghana', 'Grèce', 'Grenade', 'Guatemala', 'Guinée',
  'Guinée-Bissau', 'Guinée équatoriale', 'Guyana', 'Haïti', 'Honduras', 'Hongrie', 'Inde',
  'Indonésie', 'Irak', 'Iran', 'Irlande', 'Islande', 'Israël', 'Italie', 'Jamaïque', 'Japon',
  'Jordanie', 'Kazakhstan', 'Kenya', 'Kirghizistan', 'Kiribati', 'Kosovo', 'Koweït', 'Laos',
  'Lesotho', 'Lettonie', 'Liban', 'Libéria', 'Libye', 'Liechtenstein', 'Lituanie', 'Luxembourg',
  'Macédoine du Nord', 'Madagascar', 'Malaisie', 'Malawi', 'Maldives', 'Mali', 'Malte',
  'Maroc', 'Marshall', 'Maurice', 'Mauritanie', 'Mexique', 'Micronésie', 'Moldavie', 'Monaco',
  'Mongolie', 'Monténégro', 'Mozambique', 'Namibie', 'Nauru', 'Népal', 'Nicaragua', 'Niger',
  'Nigéria', 'Norvège', 'Nouvelle-Zélande', 'Oman', 'Ouganda', 'Ouzbékistan', 'Pakistan',
  'Palaos', 'Panama', 'Papouasie-Nouvelle-Guinée', 'Paraguay', 'Pays-Bas', 'Pérou', 'Philippines',
  'Pologne', 'Portugal', 'Qatar', 'RD Congo', 'République dominicaine', 'République tchèque',
  'Roumanie', 'Royaume-Uni', 'Russie', 'Rwanda', 'Saint-Kitts-et-Nevis', 'Saint-Marin',
  'Saint-Vincent-et-les-Grenadines', 'Sainte-Lucie', 'Salomon', 'Salvador', 'Samoa',
  'São Tomé-et-Príncipe', 'Sénégal', 'Serbie', 'Seychelles', 'Sierra Leone', 'Singapour',
  'Slovaquie', 'Slovénie', 'Somalie', 'Soudan', 'Soudan du Sud', 'Sri Lanka', 'Suède',
  'Suisse', 'Suriname', 'Syrie', 'Tadjikistan', 'Tanzanie', 'Tchad', 'Thaïlande', 'Timor oriental',
  'Togo', 'Tonga', 'Trinité-et-Tobago', 'Tunisie', 'Turkménistan', 'Turquie', 'Tuvalu',
  'Ukraine', 'Uruguay', 'Vanuatu', 'Vatican', 'Venezuela', 'Vietnam', 'Yémen', 'Zambie', 'Zimbabwe',
]

const formatPlate = (value) => {
  const clean = value.replace(/[^A-Z0-9]/g, '').toUpperCase()
  if (clean.length <= 2) return clean
  if (clean.length <= 5) return clean.slice(0, 2) + '-' + clean.slice(2)
  return clean.slice(0, 2) + '-' + clean.slice(2, 5) + '-' + clean.slice(5, 7)
}

const formatPhone = (value, code) => {
  const clean = value.replace(/\D/g, '')
  if (code === '+33') {
    // Format français : X XX XX XX XX
    const local = clean.startsWith('0') ? clean.slice(1) : clean
    if (local.length === 0) return ''
    const first = local.slice(0, 1)
    const rest = local.slice(1).match(/.{1,2}/g) || []
    return [first, ...rest].join(' ').slice(0, 14)
  }
  // Format générique : groupes de 3
  const parts = clean.match(/.{1,3}/g) || []
  return parts.join(' ').slice(0, 15)
}

const emptyVehicle = { plate: '', brand: '', model: '', year: '', color: '', energy: '' }

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [phoneCode, setPhoneCode] = useState('+33')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showCodePicker, setShowCodePicker] = useState(false)
  const [codeSearch, setCodeSearch] = useState('')

  const [form, setForm] = useState({
    first_name: '', last_name: '',
    email: '', password: '', confirm_password: '',
    address: '', city: '', postal_code: '', country: 'France',
    plate: '', vehicle_brand: '', vehicle_model: '',
    vehicle_year: '', vehicle_color: '', vehicle_energy: ''
  })

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handlePasswordChange = (val) => {
    update('password', val)
    if (form.confirm_password && val !== form.confirm_password) {
      setPasswordError('Les mots de passe ne correspondent pas')
    } else {
      setPasswordError('')
    }
  }

  const handleConfirmPasswordChange = (val) => {
    update('confirm_password', val)
    if (val && form.password !== val) {
      setPasswordError('Les mots de passe ne correspondent pas')
    } else {
      setPasswordError('')
    }
  }

  const handlePlateChange = (val) => {
    const formatted = formatPlate(val)
    update('plate', formatted)
  }

  const handlePhoneChange = (val) => {
    const formatted = formatPhone(val, phoneCode)
    setPhoneNumber(formatted)
  }

  const fetchVehicle = async () => {
    if (!form.plate) return
    setLoading(true)
    try {
      const clean = form.plate.replace(/-/g, '')
      const res = await fetch(`https://api-lapi.com/lapi/immat/json/${clean}`)
      const data = await res.json()
      if (data?.marque) {
        update('vehicle_brand', data.marque || '')
        update('vehicle_model', data.modele || '')
        update('vehicle_year', data.annee || '')
        update('vehicle_color', data.couleur || '')
        update('vehicle_energy', data.energie || '')
      }
    } catch {}
    setLoading(false)
  }

  const validateStep1 = (e) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) {
      setPasswordError('Les mots de passe ne correspondent pas')
      return
    }
    if (form.password.length < 6) {
      setPasswordError('Le mot de passe doit faire au moins 6 caractères')
      return
    }
    setPasswordError('')
    setStep(2)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fullPhone = phoneNumber ? `${phoneCode} ${phoneNumber}` : ''

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.first_name,
          last_name: form.last_name,
          phone: fullPhone,
          address: form.address,
          postal_code: form.postal_code,
          city: form.city,
          country: form.country,
          plate: form.plate,
          vehicle_brand: form.vehicle_brand,
          vehicle_model: form.vehicle_model,
          vehicle_year: form.vehicle_year,
          vehicle_color: form.vehicle_color,
          vehicle_energy: form.vehicle_energy,
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    localStorage.setItem('fyndzz_pending_email', form.email)
    router.push('/confirm-email')
    setLoading(false)
  }

  const filteredCodes = PHONE_CODES.filter(c =>
    c.country.toLowerCase().includes(codeSearch.toLowerCase()) ||
    c.code.includes(codeSearch)
  )

  const selectedCode = PHONE_CODES.find(c => c.code === phoneCode)

  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px', color: '#fff',
    fontSize: '0.95rem', outline: 'none',
    boxSizing: 'border-box', marginBottom: '1rem'
  }

  const labelStyle = {
    display: 'block', fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem'
  }

  const selectStyle = {
    ...inputStyle, cursor: 'pointer',
    color: '#fff', appearance: 'none', WebkitAppearance: 'none',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #3D2CD5 0%, #160C6B 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif', padding: '2rem 0'
    }}>
      <style>{`
        select option { background: #1e1a6e; color: #fff; }
        input::placeholder { color: rgba(255,255,255,0.3); }
        .code-picker { position: absolute; top: 100%; left: 0; right: 0; background: #1e1a6e; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; z-index: 100; max-height: 200px; overflow-y: auto; margin-top: 4px; }
        .code-picker::-webkit-scrollbar { width: 4px; }
        .code-picker::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
        .code-option { padding: 8px 12px; cursor: pointer; font-size: 0.88rem; color: #fff; display: flex; align-items: center; gap: 8px; }
        .code-option:hover { background: rgba(255,255,255,0.1); }
      `}</style>

      <div style={{
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '20px', padding: '2.5rem',
        width: '100%', maxWidth: '440px',
        backdropFilter: 'blur(20px)', margin: '0 1rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Image src="/Logo-et-Titre-paysage-RBG_Fyndzz.png" alt="Fyndzz" width={200} height={48} style={{ objectFit: 'contain', display: 'block', margin: '0 auto' }} />
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', marginTop: '0.5rem' }}>Créer votre compte</div>
        </div>

        {/* Progress bar */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: '4px', borderRadius: '2px', background: step >= s ? '#00FF66' : 'rgba(255,255,255,0.15)' }} />
          ))}
        </div>

        <form onSubmit={step === 1 ? validateStep1 : step === 2 ? (e) => { e.preventDefault(); setStep(3) } : handleRegister}>

          {/* ── ÉTAPE 1 — Compte ── */}
          {step === 1 && (
            <>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Étape 1 — Compte</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={labelStyle}>Prénom</label>
                  <input style={inputStyle} placeholder="Marie" value={form.first_name} onChange={e => update('first_name', e.target.value)} required />
                </div>
                <div>
                  <label style={labelStyle}>Nom</label>
                  <input style={inputStyle} placeholder="Dupont" value={form.last_name} onChange={e => update('last_name', e.target.value)} required />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Adresse e-mail</label>
                <input style={inputStyle} type="email" placeholder="vous@exemple.fr" value={form.email} onChange={e => update('email', e.target.value)} required />
              </div>

              <div>
                <label style={labelStyle}>Mot de passe</label>
                <input style={{ ...inputStyle, borderColor: passwordError ? 'rgba(255,77,109,0.5)' : 'rgba(255,255,255,0.15)' }} type="password" placeholder="••••••••" value={form.password} onChange={e => handlePasswordChange(e.target.value)} required minLength={6} />
              </div>

              <div>
                <label style={labelStyle}>Confirmer le mot de passe</label>
                <input style={{ ...inputStyle, borderColor: passwordError ? 'rgba(255,77,109,0.5)' : 'rgba(255,255,255,0.15)' }} type="password" placeholder="••••••••" value={form.confirm_password} onChange={e => handleConfirmPasswordChange(e.target.value)} required minLength={6} />
              </div>

              {passwordError && (
                <div style={{ color: '#FF4D6D', fontSize: '0.82rem', marginBottom: '0.8rem', marginTop: '-0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ⚠️ {passwordError}
                </div>
              )}

              {/* Téléphone avec indicatif */}
              <div>
                <label style={labelStyle}>Téléphone</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', position: 'relative' }}>
                  {/* Sélecteur indicatif */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => setShowCodePicker(!showCodePicker)}
                      style={{
                        padding: '0.8rem 0.75rem',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '10px', color: '#fff',
                        fontSize: '0.9rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {selectedCode?.flag} {phoneCode} ▾
                    </button>
                    {showCodePicker && (
                      <div className="code-picker">
                        <div style={{ padding: '6px 8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <input
                            type="text"
                            placeholder="Rechercher..."
                            value={codeSearch}
                            onChange={e => setCodeSearch(e.target.value)}
                            style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                            onClick={e => e.stopPropagation()}
                          />
                        </div>
                        {filteredCodes.map(c => (
                          <div
                            key={c.code + c.country}
                            className="code-option"
                            onClick={() => { setPhoneCode(c.code); setShowCodePicker(false); setCodeSearch('') }}
                          >
                            <span>{c.flag}</span>
                            <span>{c.country}</span>
                            <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{c.code}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Numéro */}
                  <input
                    style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                    type="tel"
                    placeholder={phoneCode === '+33' ? '7 82 98 89 61' : '000 000 000'}
                    value={phoneNumber}
                    onChange={e => handlePhoneChange(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" style={{ width: '100%', padding: '0.9rem', background: '#00FF66', color: '#0A0040', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' }}>
                Continuer →
              </button>
            </>
          )}

          {/* ── ÉTAPE 2 — Adresse ── */}
          {step === 2 && (
            <>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Étape 2 — Adresse</div>

              <div>
                <label style={labelStyle}>Rue</label>
                <input style={inputStyle} placeholder="12 rue de la Paix" value={form.address} onChange={e => update('address', e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={labelStyle}>Code postal</label>
                  <input style={inputStyle} placeholder="75001" value={form.postal_code} onChange={e => update('postal_code', e.target.value)} required />
                </div>
                <div>
                  <label style={labelStyle}>Ville</label>
                  <input style={inputStyle} placeholder="Paris" value={form.city} onChange={e => update('city', e.target.value)} required />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Pays</label>
                <select value={form.country} onChange={e => update('country', e.target.value)} style={selectStyle}>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '0.9rem', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer' }}>← Retour</button>
                <button type="submit" style={{ flex: 2, padding: '0.9rem', background: '#00FF66', color: '#0A0040', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' }}>Continuer →</button>
              </div>
            </>
          )}

          {/* ── ÉTAPE 3 — Véhicule ── */}
          {step === 3 && (
            <>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Étape 3 — Votre véhicule</div>

              <div>
                <label style={labelStyle}>Plaque d'immatriculation</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input
                    style={{ ...inputStyle, marginBottom: 0, flex: 1, fontFamily: 'monospace', letterSpacing: '0.05em', textTransform: 'uppercase' }}
                    placeholder="AB-123-CD"
                    value={form.plate}
                    onChange={e => handlePlateChange(e.target.value)}
                    maxLength={9}
                  />
                  <button type="button" onClick={fetchVehicle} disabled={loading} style={{ padding: '0 1rem', background: 'rgba(0,255,102,0.15)', border: '1px solid rgba(0,255,102,0.3)', borderRadius: '10px', color: '#00FF66', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {loading ? '...' : '🔍 Auto'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {[
                  { key: 'vehicle_brand', label: 'Marque', placeholder: 'Renault' },
                  { key: 'vehicle_model', label: 'Modèle', placeholder: 'Clio' },
                  { key: 'vehicle_year', label: 'Année', placeholder: '2020' },
                  { key: 'vehicle_color', label: 'Couleur', placeholder: 'Blanc' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input style={inputStyle} placeholder={placeholder} value={form[key]} onChange={e => update(key, e.target.value)} />
                  </div>
                ))}
              </div>

              <div>
                <label style={labelStyle}>Énergie</label>
                <select value={form.vehicle_energy} onChange={e => update('vehicle_energy', e.target.value)} style={selectStyle}>
                  <option value="">Sélectionner</option>
                  <option value="Essence">Essence</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Électrique">Électrique</option>
                  <option value="Hybride">Hybride</option>
                  <option value="GPL">GPL</option>
                </select>
              </div>

              {error && (
                <div style={{ color: '#FF4D6D', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>
                  {error}
                </div>
              )}

              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginBottom: '1rem', lineHeight: '1.5' }}>
                En créant un compte, vous acceptez nos{' '}
                <Link href="/legal" style={{ color: '#00FF66', textDecoration: 'underline' }}>Conditions Générales d&apos;Utilisation</Link>{' '}
                et notre{' '}
                <Link href="/legal" style={{ color: '#00FF66', textDecoration: 'underline' }}>Politique de Confidentialité</Link>.
              </div>

              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button type="button" onClick={() => setStep(2)} style={{ flex: 1, padding: '0.9rem', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer' }}>← Retour</button>
                <button type="submit" disabled={loading} style={{ flex: 2, padding: '0.9rem', background: '#00FF66', color: '#0A0040', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Création...' : 'Créer mon compte →'}
                </button>
              </div>
            </>
          )}
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
          Déjà un compte ?{' '}
          <Link href="/login" style={{ color: '#00FF66', textDecoration: 'none', fontWeight: '600' }}>Se connecter</Link>
        </div>
      </div>
    </div>
  )
}