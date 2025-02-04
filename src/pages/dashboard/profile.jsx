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
import { useState } from "react";
import { Link } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { platformSettingsData, conversationsData, projectsData } from "@/data";

export function Profile() {

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
                src="/img/bruce-mars.jpeg"
                alt="bruce-mars"
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  Andika Supriyadi Nur Maulana
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  Siswa XII RPL 2
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

                  <Tab value="settings">
                    <Cog6ToothIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Settings
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
            <form>
              <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">

                  <div className="border-b border-gray-900/10 pb-12">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                    <div className="col-span-full">
                        <label htmlFor="street-address" className="block text-sm/6 font-medium text-gray-900">
                          NISN
                        </label>
                        <div className="mt-2">
                          <input
                            id="nisn"
                            name="nisn"
                            type="text"
                            autoComplete="nisn"
                            className="block w-full rounded-md border border-gray-400 bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label htmlFor="street-address" className="block text-sm/6 font-medium text-gray-900">
                          NIS
                        </label>
                        <div className="mt-2">
                          <input
                            id="nis"
                            name="nis"
                            type="text"
                            autoComplete="nis"
                            className="block w-full rounded-md border border-gray-400 bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
                            name="first-name"
                            type="text"
                            autoComplete="given-name"
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
                            name="last-name"
                            type="text"
                            autoComplete="family-name"
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
                            autoComplete="email"
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
                            name="street-address"
                            type="text"
                            autoComplete="street-address"
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
                            autoComplete="address-level2"
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
                            name="region"
                            type="text"
                            autoComplete="address-level1"
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
                            name="postal-code"
                            type="text"
                            autoComplete="postal-code"
                            className="block w-full rounded-md border border-gray-400 bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
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
                            <img src={image} alt="Preview" className="size-12 rounded-full object-cover" />
                          ) : (
                            <UserCircleIcon className="size-12 text-gray-300" />
                          )}

                          <input type="file" accept="image/*" className="hidden" id="fileUpload" onChange={handleFileChange} />
                          <button
                            type="button"
                            onClick={() => document.getElementById("fileUpload").click()}
                            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
                          >
                            Change
                          </button>
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
                <button type="button" className="text-sm/6 font-semibold text-gray-900">
                  Cancel
                </button>
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
