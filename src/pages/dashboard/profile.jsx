import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Switch,
  Tooltip,
  Button,
  iconButton,
  IconButton
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
  PhotoIcon,
  UserCircleIcon,
  ChevronDownIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';

import { Link } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { platformSettingsData, conversationsData, projectsData } from "@/data";
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from "@/config";

export function Profile() {
  const [isZoomed, setIsZoomed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    jenisKelamin: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    photo: null,
    coverPhoto: null
  });

  const imageUrl =
    formData.photo instanceof File
      ? URL.createObjectURL(formData.photo)
      : formData.photo || "https://www.gravatar.com/avatar/?d=mp";

  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: "Error!",
          text: "File size should not exceed 5MB",
          icon: "error",
          timer: 2000, // Timer 2 detik (2000ms)
          showConfirmButton: false,
        });
        e.target.value = '';
        return;
      }

      if (!file.type.startsWith('image/')) {
        Swal.fire({
          title: "Error!",
          text: "Only image files are allowed",
          icon: "error",
          timer: 2000, // Timer 2 detik (2000ms)
          showConfirmButton: false,
        });
        e.target.value = '';
        return;
      }

      setImage(URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
    }
  };

  const [previewImage, setPreviewImage] = useState(null); // Nama const berbeda

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: "Error!",
          text: "File size should not exceed 5MB",
          icon: "error",
          timer: 2000, // Timer 2 detik (2000ms)
          showConfirmButton: false,
        });
        e.target.value = '';
        return;
      }

      if (!file.type.startsWith('image/')) {
        Swal.fire({
          title: "Error!",
          text: "Only image files are allowed",
          icon: "error",
          timer: 2000, // Timer 2 detik (2000ms)
          showConfirmButton: false,
        });
        e.target.value = '';
        return;
      }

      setPreviewImage(URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        coverPhoto: file
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const navigate = useNavigate(); // Hook untuk redirect
  const [userRole, setUserRole] = useState(null); // ✅ Tambahkan state untuk role
  // const [swalShown, setSwalShown] = useState(false); // ✅ Tambahkan state untuk Swal

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedToken = localStorage.getItem("token");


        if (!storedToken) {
          navigate("/auth/sign-in");
          return;
        }

        // Decode JWT untuk mendapatkan role
        const decodedToken = jwtDecode(storedToken);
        const userRole = decodedToken.role;
        setUserRole(userRole);

        // Tentukan endpoint berdasarkan role
        let response;
        if (userRole === "siswa") {
          response = await fetch(`${API_BASE_URL}/api/siswa/profile`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
        } else if (userRole === "guru") {
          response = await fetch(`${API_BASE_URL}/api/guru/profile`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
        } else if (userRole === "admin") {
          response = await fetch(`${API_BASE_URL}/api/admin/profile`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
        }

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data.data);

        if (userRole === "siswa") {
          setFormData({
            firstName: data.data.firstName || '',
            lastName: data.data.lastName || '',
            email: data.data.email || '',
            jenisKelamin: data.data.jenisKelamin || '',
            street: data.data.alamat?.street || '',
            city: data.data.alamat?.city || '',
            state: data.data.alamat?.state || '',
            postalCode: data.data.alamat?.postalCode || '',
            photo: data.data.photo || null,
            coverPhoto: data.data.coverPhoto || null
          });
        } else if (userRole === "guru") {
          setFormData({
            nama: data.data.nama || '',
            firstName: data.data.firstName || '',
            lastName: data.data.lastName || '',
            email: data.data.email || '',
            mataPelajaran: data.data.mataPelajaran || '',
            noTelp: data.data.noTelp || '',
            pendidikanTerakhir: data.data.pendidikanTerakhir || '',
            jenisKelamin: data.data.jenisKelamin || '',
            street: data.data.alamat?.street || '',
            city: data.data.alamat?.city || '',
            state: data.data.alamat?.state || '',
            postalCode: data.data.alamat?.postalCode || '',
            photo: data.data.photo || null,
            coverPhoto: data.data.coverPhoto || null
          });
        } else if (userRole === "admin") {
          setFormData({
            firstName: data.data.firstName || '',
            lastName: data.data.lastName || '',
            nama: data.data.nama || '',
            email: data.data.email || '',
            jenisKelamin: data.data.jenisKelamin || '',
            noTelp: data.data.noTelp || '',
            street: data.data.alamat?.street || '',
            city: data.data.alamat?.city || '',
            state: data.data.alamat?.state || '',
            postalCode: data.data.alamat?.postalCode || '',
            photo: data.data.photo || null,
            coverPhoto: data.data.coverPhoto || null
          });
        }

        // Jika ada foto, gunakan URL langsung dari API
        if (data.data.photo) {
          setImage(data.data.photo);
          setFormData(prev => ({
            ...prev,
            photo: data.data.photo
          }));
        }
        if (data.data.coverPhoto) {
          setPreviewImage(data.data.coverPhoto);
          setFormData(prev => ({
            ...prev,
            coverPhoto: data.data.coverPhoto
          }));
        }

      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Add text fields
      Object.keys(formData).forEach(key => {
        if (!['photo', 'coverPhoto', 'street', 'city', 'state', 'postalCode'].includes(key)) {
          formDataToSend.append(key, formData[key] || '');
        }
      });

      // Add address fields as a single JSON object
      const alamatData = {
        street: formData.street || '',
        city: formData.city || '',
        state: formData.state || '',
        postalCode: formData.postalCode || ''
      };

      formDataToSend.append('alamat', JSON.stringify(alamatData));

      // Add files if they exist and are new
      if (formData.photo instanceof File) {
        formDataToSend.append('photo', formData.photo);
      }

      if (formData.coverPhoto instanceof File) {
        formDataToSend.append('coverPhoto', formData.coverPhoto);
      }

      const storedToken = localStorage.getItem("token");
      
      // Determine endpoint based on user role
      let endpoint;
      if (userRole === "siswa") {
        endpoint = `${API_BASE_URL}/api/siswa/profile`;
      } else if (userRole === "guru") {
        endpoint = `${API_BASE_URL}/api/guru/profile`;
      } else if (userRole === "admin") {
        endpoint = `${API_BASE_URL}/api/admin/profile`;
      } else {
        throw new Error('Invalid user role');
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${storedToken}`
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update profile');
      }

      // Update displayed data
      setUserData(result.data);
      if (result.data.photo) setImage(result.data.photo);
      if (result.data.coverPhoto) setPreviewImage(result.data.coverPhoto);

      Swal.fire({
        title: "Success!",
        text: "Profile updated successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
        {formData.coverPhoto && (
          <img
            src={formData.coverPhoto instanceof File ?
              URL.createObjectURL(formData.coverPhoto) :
              (formData.coverPhoto.startsWith('http') ?
                formData.coverPhoto :
                `/uploads/profilepicture/${formData.coverPhoto.split('/').pop()}`
              )}
            alt="Cover"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <>
                {/* Avatar (klik untuk zoom-in) */}
                <Avatar
                  src={imageUrl}
                  alt="Profile"
                  size="xl"
                  variant="rounded"
                  className="rounded-lg shadow-lg shadow-blue-gray-500/40 cursor-pointer"
                  onClick={() => setIsZoomed(true)}
                />

                {/* Modal zoom-in */}
                {isZoomed && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
                    onClick={() => setIsZoomed(false)} // Klik di luar = close
                  >
                    <div
                      className="relative bg-white p-2 rounded-2xl shadow-xl"
                      onClick={(e) => e.stopPropagation()} // Mencegah klik dalam modal menutup overlay
                    >
                      {/* Tombol close */}
                      <IconButton
                        size="sm"
                        variant="text"
                        className="!absolute right-3.5 top-3.5 text-gray-600 hover:text-gray-900"
                        onClick={() => setIsZoomed(false)}
                      >
                        <XMarkIcon className="h-4 w-4 stroke-2" />
                      </IconButton>


                      {/* Gambar dalam ukuran besar */}
                      <img src={imageUrl} alt="Profile Zoomed" className="max-w-full max-h-[90vh] rounded-lg" />
                    </div>
                  </div>
                )}
              </>
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {userData?.nama || <div className="h-4 bg-gray-300 rounded w-20"></div>}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  {userRole === 'guru' ? 'Guru Wali Kelas' : userRole === 'siswa' ? 'Siswa' : userRole === 'admin' ? 'Admin' : <div className="h-4 bg-gray-300 rounded w-20"></div>} {userRole !== 'admin' && (userData?.kelas || <div className="h-4 bg-gray-300 rounded w-20"></div>)}

                </Typography>
              </div>
            </div>
            <div className="w-96">
              <Tabs value="app">
                <TabsHeader>
                  <Tab value="app">
                    <UserIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Profile
                  </Tab>
                </TabsHeader>
              </Tabs>
            </div>
          </div>

          <div className="px-4 pb-4">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Data Diri {userRole === 'guru' ? 'Guru Wali Kelas' : userRole === 'siswa' ? 'Siswa' : userRole === 'admin' ? 'Admin' : <div className="h-4 bg-gray-300 rounded w-20"></div>}
            </Typography>
            <Typography
              variant="small"
              className="font-normal text-blue-gray-500"
            >
              Data Diri Lengkap {userRole === 'guru' ? 'Guru Wali Kelas' : userRole === 'siswa' ? 'Siswa' : userRole === 'admin' ? 'Admin' : <div className="h-4 bg-gray-300 rounded w-20"></div>}
            </Typography>
            <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">

                  <div className="border-b border-gray-900/10 pb-12">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                      {userRole === 'guru' ? <> <div className="col-span-full">
                        <label htmlFor="nip" className="block text-sm/6 font-medium text-gray-900">
                          NIP
                        </label>
                        <div className="mt-2">
                          <input
                            id="nip"
                            name="nip"
                            type="text"
                            value={userData?.nip || ''}
                            disabled
                            className="block w-full rounded-md border border-gray-400 bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>
                      </> :
                        userRole === 'siswa' ? <> <div className="col-span-full">
                          <label htmlFor="nisn" className="block text-sm/6 font-medium text-gray-900">
                            NISN
                          </label>
                          <div className="mt-2">
                            <input
                              id="nisn"
                              name="nisn"
                              type="text"
                              value={userData?.nisn || ''}
                              disabled
                              className="block w-full rounded-md border border-gray-400 bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                          </div>
                        </div>

                          <div className="col-span-full">
                            <label htmlFor="nis" className="block text-sm/6 font-medium text-gray-900">
                              NIS
                            </label>
                            <div className="mt-2">
                              <input
                                id="nis"
                                name="nis"
                                type="text"
                                value={userData?.nis || ''}
                                disabled
                                className="block w-full rounded-md border border-gray-400 bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                              />
                            </div>
                          </div>
                        </> :
                          userRole === 'admin' ? <>
                            <div className="sm:col-span-full">
                              <label htmlFor="noTelp" className="block text-sm/6 font-medium text-gray-900">
                                No Telepon
                              </label>
                              <div className="mt-2">
                                <input
                                  type="tel"
                                  name="noTelp"
                                  value={formData.noTelp || ''}
                                  onChange={handleInputChange}
                                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>
                          </> :
                            <div className="h-4 bg-gray-300 rounded w-20"></div>}

                      <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-900">
                          First name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName || ''}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="last-name" className="block text-sm/6 font-medium text-gray-900">
                          Last name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-full">
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                          Email address
                        </label>
                        <div className="mt-2">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      {userRole === "guru" && (
                        <div className="sm:col-span-full">
                          <label htmlFor="mataPelajaran" className="block text-sm/6 font-medium text-gray-900">
                            Mata Pelajaran
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="mataPelajaran"
                              value={formData.mataPelajaran}
                              onChange={handleInputChange}
                              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      )}

                      {userRole === "guru" && (
                        <div className="sm:col-span-full">
                          <label htmlFor="pendidikanTerakhir" className="block text-sm/6 font-medium text-gray-900">
                            Pendidikan Terakhir
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="pendidikanTerakhir"
                              value={formData.pendidikanTerakhir}
                              onChange={handleInputChange}
                              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      )}

                      {userRole === "guru" && (
                        <div className="sm:col-span-full">
                          <label htmlFor="noTelp" className="block text-sm/6 font-medium text-gray-900">
                            No Telepon
                          </label>
                          <div className="mt-2">
                            <input
                              type="tel"
                              name="noTelp"
                              value={formData.noTelp}
                              onChange={handleInputChange}
                              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      )}

                      <div className="col-span-full">
                        <label htmlFor="street-address" className="block text-sm/6 font-medium text-gray-900">
                          Street address
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2 sm:col-start-1">
                        <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">
                          City
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="region" className="block text-sm/6 font-medium text-gray-900">
                          State / Province
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="postal-code" className="block text-sm/6 font-medium text-gray-900">
                          ZIP / Postal code
                        </label>
                        <div className="mt-2">
                          <input
                            type="number"
                            name="postalCode"
                            id="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-full">
                        <label htmlFor="nama" className="block text-sm/6 font-medium text-gray-900">
                          Nama Lengkap
                        </label>
                        <div className="mt-2">
                          <input
                            id="nama"
                            name="nama"
                            type="text"
                            value={userData?.nama || ''}
                            disabled
                            className="block w-full rounded-md border border-gray-400 bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-full">
                        <label htmlFor="kelas" className="block text-sm/6 font-medium text-gray-900">
                          Kelas
                        </label>
                        <div className="mt-2">
                          <input
                            id="kelas"
                            name="kelas"
                            type="text"
                            value={userData?.kelas || ''}
                            disabled
                            className="block w-full rounded-md border border-gray-400 bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="jenisKelamin" className="block text-sm/6 font-medium text-gray-900">
                          Jenis Kelamin
                        </label>
                        <div className="mt-2">
                          {userData?.jenisKelamin ? (
                            // Jika userData.jenisKelamin sudah ada, hanya menampilkan pilihan yang sesuai dan disable dropdown
                            <select
                              id="jenisKelamin"
                              name="jenisKelamin"
                              value={userData.jenisKelamin}
                              disabled
                              required
                              className="block w-full rounded-md border border-gray-400 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                              <option value={userData.jenisKelamin}>
                                {userData.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
                              </option>
                            </select>
                          ) : (
                            // Jika userData.jenisKelamin belum ada, tampilkan dropdown yang bisa dipilih
                            <select
                              id="jenisKelamin"
                              name="jenisKelamin"
                              value={formData.jenisKelamin}
                              onChange={handleInputChange}
                              className="block w-full rounded-md border border-gray-400 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                              <option value="">Pilih Jenis Kelamin</option>
                              <option value="L">Laki-laki</option>
                              <option value="P">Perempuan</option>
                            </select>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="col-span-2">
                      <label htmlFor="photo" className="block text-sm/6 font-medium text-gray-900">
                        Photo
                      </label>
                      <div className="mt-2 flex items-center gap-x-3">

                        <div className="flex flex-col items-center gap-2">
                          {image ? (
                            <img src={image} alt="Preview" className="size-12 rounded-lg object-cover" />
                          ) : (
                            <UserCircleIcon className="size-12 text-gray-300" />
                          )}

                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="fileUpload"
                            name="photo"
                            onChange={handleFileChange}
                          />

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => document.getElementById("fileUpload").click()}
                              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
                            >
                              Change
                            </button>
                            {image && (
                              <button
                                type="button"
                                onClick={() => {
                                  setImage(null);
                                  document.getElementById("fileUpload").value = '';
                                }}
                                className="rounded-md bg-red-500 px-2.5 py-1.5 text-sm font-semibold text-white hover:bg-red-600"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-gray-900">
                        Cover photo
                      </label>
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                          <div
                            className="border-gray-300 p-6 rounded-md text-center cursor-pointer hover:bg-gray-50"
                            onClick={() => document.getElementById("image-upload-input").click()} // ID unik
                          >
                            {previewImage ? (
                              <img src={previewImage} alt="Selected Preview" className="mx-auto size-24 rounded-md object-cover" />
                            ) : (
                              <PhotoIcon className="mx-auto size-12 text-gray-300" />
                            )}

                            <div className="mt-4 flex justify-center text-sm text-gray-600">
                              <label
                                htmlFor="image-upload-input"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="image-upload-input"
                                  name="coverPhoto"
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={handleCoverPhotoChange}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                          </div>
                          <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default Profile;
