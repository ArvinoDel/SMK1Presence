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
} from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';

import { Link } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { platformSettingsData, conversationsData, projectsData } from "@/data";
import { useAuth } from '@/context/AuthContext';

export function Profile() {
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

  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Buat URL sementara untuk ditampilkan
    }
  };

  const [previewImage, setPreviewImage] = useState(null); // Nama const berbeda

  const handleImageChange = (e) => {
    const uploadedFile = e.target.files[0]; // Nama variabel berbeda
    if (uploadedFile) {
      setPreviewImage(URL.createObjectURL(uploadedFile)); // Menyimpan URL sementara
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/siswa/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.data);
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
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create FormData
      const formData = new FormData();
      
      // Add all form fields
      formData.append('firstName', formData.firstName);
      formData.append('lastName', formData.lastName);
      formData.append('email', formData.email);
      formData.append('jenisKelamin', formData.jenisKelamin);
      formData.append('street', formData.street);
      formData.append('city', formData.city);
      formData.append('state', formData.state);
      formData.append('postalCode', formData.postalCode);
      
      // Add images if present
      const photoInput = document.getElementById('fileUpload');
      const coverPhotoInput = document.getElementById('image-upload-input');
      
      if (photoInput.files[0]) {
        formData.append('photo', photoInput.files[0]);
      }
      if (coverPhotoInput.files[0]) {
        formData.append('coverPhoto', coverPhotoInput.files[0]);
      }

      const response = await fetch('/api/siswa/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.data);
        
        // Reset file inputs and previews
        setImage(null);
        setPreviewImage(null);
        photoInput.value = '';
        coverPhotoInput.value = '';

        Swal.fire({
          title: "Success!",
          text: "Profile updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: `Error updating profile: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src={userData?.photo || 'https://www.gravatar.com/avatar/?d=mp'}
                alt=""
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {userData?.nama || 'Loading...'}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  Siswa {userData?.kelas || 'Loading...'}
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
              Data Diri Siswa
            </Typography>
            <Typography
              variant="small"
              className="font-normal text-blue-gray-500"
            >
              Data Diri Lengkap Siswa
            </Typography>
            <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">

                  <div className="border-b border-gray-900/10 pb-12">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                      <div className="col-span-full">
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

                      <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-900">
                          First name
                        </label>
                        <div className="mt-2">
                          <input
                            id="first-name"
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border border-gray-400 bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="last-name" className="block text-sm/6 font-medium text-gray-900">
                          Last name
                        </label>
                        <div className="mt-2">
                          <input
                            id="last-name"
                            name="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border border-gray-400 bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-full">
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                          Email address
                        </label>
                        <div className="mt-2">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border border-gray-400 bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label htmlFor="street-address" className="block text-sm/6 font-medium text-gray-900">
                          Street address
                        </label>
                        <div className="mt-2">
                          <input
                            id="street-address"
                            name="street"
                            type="text"
                            value={formData.street}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border border-gray-400 bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2 sm:col-start-1">
                        <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">
                          City
                        </label>
                        <div className="mt-2">
                          <input
                            id="city"
                            name="city"
                            type="text"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border border-gray-400 bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="region" className="block text-sm/6 font-medium text-gray-900">
                          State / Province
                        </label>
                        <div className="mt-2">
                          <input
                            id="region"
                            name="state"
                            type="text"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border border-gray-400 bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="postal-code" className="block text-sm/6 font-medium text-gray-900">
                          ZIP / Postal code
                        </label>
                        <div className="mt-2">
                          <input
                            id="postal-code"
                            name="postalCode"
                            type="text"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border border-gray-400 bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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

                          <input type="file" accept="image/*" className="hidden" id="fileUpload" onChange={handleFileChange} />

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
                                onClick={handleSubmit}
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
                                  id="image-upload-input" // ID unik agar tidak bentrok
                                  name="image-upload"
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={handleImageChange} // Handler berbeda
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
