import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
  Input,
  Button,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  IconButton,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "@/data";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import { jwtDecode } from "jwt-decode";


const SkeletonRow = () => {
  return (
    <th>
      <tr className="animate-pulse">
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-300 rounded-md"></div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50 text-center">
          <div className="h-5 bg-gray-300 rounded w-14 mx-auto"></div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="h-4 bg-gray-300 rounded w-10"></div>
        </td>
      </tr>
      <tr className="animate-pulse">
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-300 rounded-md"></div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50 text-center">
          <div className="h-5 bg-gray-300 rounded w-14 mx-auto"></div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="h-4 bg-gray-300 rounded w-10"></div>
        </td>
      </tr>
      <tr className="animate-pulse">
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-300 rounded-md"></div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50 text-center">
          <div className="h-5 bg-gray-300 rounded w-14 mx-auto"></div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="h-4 bg-gray-300 rounded w-10"></div>
        </td>
      </tr>
      <tr className="animate-pulse">
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-300 rounded-md"></div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50 text-center">
          <div className="h-5 bg-gray-300 rounded w-14 mx-auto"></div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="h-4 bg-gray-300 rounded w-10"></div>
        </td>
      </tr>
      <tr className="animate-pulse">
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-300 rounded-md"></div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50 text-center">
          <div className="h-5 bg-gray-300 rounded w-14 mx-auto"></div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </td>
        <td className="py-3 px-5 border-b border-blue-gray-50">
          <div className="h-4 bg-gray-300 rounded w-10"></div>
        </td>
      </tr>
    </th>
  );
};

const itemsPerPage = 5;

const ITEMS_PER_PAGE = 5; // Jumlah data per halaman

const TABS = [
  { label: "All", value: "all" },
  { label: "Guru", value: "guru" },
  { label: "Siswa", value: "siswa" },
];

const TABLE_HEAD = ["Users", "Email", "Kelas", "Status", "Employed", "Action"];

const TABLE_ROWS = [
  { img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg", name: "John Michael", nis: "12228442", nisn: "0022299922", role: "XII RPL 2", email: "siswa@gmail.com", isGuru: true, date: "23/04/18" },
  { img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg", name: "Alexa Liras", nis: "12228443", nisn: "0022299923", role: "XII RPL 2", email: "siswa1@gmail.com", isGuru: false, date: "23/04/18" },
  { img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg", name: "Laurent Perrier", nis: "12228444", nisn: "0022299924", role: "XII RPL 2", email: "siswa2@gmail.com", isGuru: true, date: "19/09/17" },
  { img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg", name: "Michael Levi", nis: "12228345", nisn: "0022259925", role: "XII RPL 2", email: "siswa3@gmail.com", isGuru: false, date: "24/12/08" },
  { img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg", name: "Richard Gran", nis: "12228346", nisn: "0022249926", role: "XII RPL 2", email: "siswa4@gmail.com", isGuru: true, date: "04/10/21" },
  { img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg", name: "Jihn Miracle", nis: "12228432", nisn: "0022296922", role: "XII RPL 2", email: "siswa@gmail.com", isGuru: true, date: "23/04/18" },
  { img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg", name: "Kobe Liras", nis: "12228343", nisn: "0022297923", role: "XII DPIB 2", email: "siswa1@gmail.com", isGuru: false, date: "23/04/18" },
  { img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg", name: "Sabrina Perrier", nis: "12258444", nisn: "0021299924", role: "XII RPL 2", email: "siswa2@gmail.com", isGuru: true, date: "19/09/17" },
  { img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg", name: "Trevor Levi", nis: "12228475", nisn: "0022299921", role: "XII TOI 2", email: "siswa3@gmail.com", isGuru: false, date: "24/12/08" },
  { img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg", name: "Lee Gran", nis: "12228432", nisn: "0022299226", role: "XII TKJ 2", email: "siswa4@gmail.com", isGuru: true, date: "04/10/21" },
];

export function History() {
  const [riwayatAbsensi, setRiwayatAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const [imageSrc, setImageSrc] = useState("");
  const navigate = useNavigate(); // Hook untuk redirect
  const [userRole, setUserRole] = useState(null); // ✅ Tambahkan state untuk role
  const galleryRef = useRef(null);
  const [kelasInfo, setKelasInfo] = useState({
    kelas: '',
    tahun: new Date().getFullYear()
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [pageIndex, setPageIndex] = useState(0); // Index halaman tanpa state global

  // **🔍 Filter Data Berdasarkan Role dan Search Query**
  const filteredData = useMemo(() => {
    console.log("Filtering Data...");
    console.log("Selected Filter:", selectedFilter);
    console.log("Search Query:", searchQuery);

    return TABLE_ROWS.filter((user) => {
      const query = searchQuery.toLowerCase();

      // **Filter Berdasarkan Role**
      const matchRole =
        selectedFilter === "all" ||
        (selectedFilter === "guru" && user.isGuru === true) ||
        (selectedFilter === "siswa" && user.isGuru === false);

      // **Filter Berdasarkan Search Query**
      const matchSearch =
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      // **Gabungkan Kedua Filter**
      return matchRole && matchSearch;
    });
  }, [searchQuery, selectedFilter]);


  // **📌 Pagination: Ambil data berdasarkan halaman**
  const paginatedData = useMemo(() => {
    const start = pageIndex * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, pageIndex]);

  useEffect(() => {
    const fetchRiwayatAbsensi = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          navigate("auth/sign-in");
          return;
        }

        const decodedToken = jwtDecode(storedToken);
        setUserRole(decodedToken.role);
        const userRole = decodedToken.role;
        let apiUrl;

        switch (userRole) {
          case "siswa":
            apiUrl = "http://localhost:3000/api/absensi/riwayat";
            break;
          case "guru":
            apiUrl = "http://localhost:3000/api/absensi/wali-kelas/riwayat";
            break;
          case "admin":
            apiUrl = "";
            break;
          default:
            console.warn("User role tidak valid");
            navigate("auth/sign-in");
            return;
        }

        const response = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
          }
          navigate("/auth/sign-in");
          return;
        }

        const result = await response.json();

        // Format data berdasarkan role
        if (userRole === "guru") {
          // Flatten data yang dikelompokkan per tanggal
          const flattenedData = result.data.reduce((acc, group) => {
            return acc.concat(group.data.map(item => ({
              ...item,
              tanggal: group.tanggal
            })));
          }, []);
          setRiwayatAbsensi(flattenedData);
        } else {
          setRiwayatAbsensi(result.data);
        }

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRiwayatAbsensi();
  }, []);

  useEffect(() => {
    if (!galleryRef.current || loading) return;

    const lightbox = new PhotoSwipeLightbox({
      gallery: galleryRef.current,
      children: 'a',
      pswpModule: () => import('photoswipe'),
    });

    lightbox.init();

    return () => lightbox.destroy();
  }, [loading]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'HADIR':
        return 'green';
      case 'TERLAMBAT':
        return 'black';
      case 'IZIN':
        return 'blue';
      case 'SAKIT':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(riwayatAbsensi.length / itemsPerPage);

  const currentData = riwayatAbsensi.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPhotoUrl = (photo) => {
    if (!photo) return "https://www.gravatar.com/avatar/?d=mp";
    if (photo.startsWith('http')) return photo;
    return `/uploads/${photo.split('/').pop()}`; // Ambil nama file saja
  };

  useEffect(() => {
    const fetchKelasInfo = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/guru/profile", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        const result = await response.json();
        setKelasInfo({
          kelas: result.data.kelas,
          tahun: new Date().getFullYear()
        });
      } catch (error) {
        console.error("Error fetching kelas info:", error);
      }
    };

    if (userRole === "guru") {
      fetchKelasInfo();
    }
  }, [userRole]);

  if (loading) return SkeletonRow();
  if (error) return <div>Error: {error}</div>;

  const baseUrl =
    "http://localhost:3000/api/absensi/rekapan-semester/download";

  return (

    <div className="mt-12 mb-8 flex flex-col gap-12">

      {userRole === "guru" && kelasInfo.kelas && (
        <div className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl">
          <Typography variant="h6" color="dark" className="text-xl font-semibold">
            Unduh Rekapan Absensi
          </Typography>
          <div className="flex flex-wrap gap-3 mt-4">
            {[1, 2, 3, 4, 5, 6].map((semester) => (
              <Button
                key={semester}
                variant="gradient"
                className="w-full sm:w-auto px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300"
                onClick={async () => {
                  const storedToken = localStorage.getItem("token");
                  const encodedKelas = encodeURIComponent(kelasInfo.kelas);
                  const url = `${baseUrl}?kelas=${encodedKelas}&semester=${semester}&tahun=${kelasInfo.tahun}`;

                  try {
                    const response = await fetch(url, {
                      headers: {
                        Authorization: `Bearer ${storedToken}`
                      }
                    });

                    if (!response.ok) throw new Error('Download gagal');

                    const blob = await response.blob();
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = `rekapan_${kelasInfo.kelas}_semester${semester}_${kelasInfo.tahun}.xlsx`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(downloadUrl);
                  } catch (error) {
                    console.error('Error:', error);
                  }
                }}
              >
                Semester {semester}
              </Button>
            ))}
          </div>
        </div>
      )}


      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Riwayat Absensi
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Siswa", "Tanggal", "Jam Masuk", "Status", "Keterangan", "Surat Izin"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody ref={galleryRef}>
              {loading
                ? Array.from({ length: itemsPerPage }).map((_, index) => <SkeletonRow key={index} />)
                : currentData.map((absen, key) => {
                  const className = `py-3 px-5 ${key === currentData.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                  return (
                    <tr key={absen.id}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar
                            src={getPhotoUrl(absen.photo)}
                            alt={absen.nama}
                            size="sm"
                            variant="rounded"
                            className="object-cover"
                          />
                          <div>
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                              {absen.nama}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {absen.nis}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{absen.tanggal}</Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{absen.jamMasuk}</Typography>
                      </td>
                      <td className={`text-center ${className}`}>
                        <Chip variant="gradient" color={getStatusColor(absen.status)} value={absen.status} className="py-0.5 px-2 text-[11px] font-medium" />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{absen.keterangan}</Typography>
                      </td>
                      <td className={className}>
                        {absen.suratIzin ? (
                          <a
                            href="#"
                            ref={(el) => {
                              if (el) {
                                const img = new Image();
                                img.src = absen.suratIzin instanceof File
                                  ? URL.createObjectURL(absen.suratIzin)
                                  : absen.suratIzin.startsWith('http')
                                    ? absen.suratIzin
                                    : `http://localhost:3000/uploads/suratizin/${absen.suratIzin.split('/').pop()}`;

                                img.onload = () => {
                                  el.setAttribute("data-pswp-src", img.src);
                                  el.setAttribute("data-pswp-width", img.naturalWidth);
                                  el.setAttribute("data-pswp-height", img.naturalHeight);
                                };
                              }
                            }}
                          >


                            <img src={
                              absen.suratIzin instanceof File ? URL.createObjectURL(absen.suratIzin) :
                                absen.suratIzin.startsWith('http') ? absen.suratIzin :
                                  `http://localhost:3000/uploads/suratizin/${absen.suratIzin.split('/').pop()}`
                            } alt="Surat Izin" className="w-12 h-12 rounded cursor-pointer shadow" />

                          </a>
                        ) : (
                          <Typography className="text-xs font-semibold text-gray-600">-</Typography>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="6" className="py-4 text-center">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className="px-3 py-1 border rounded-md hover:bg-gray-200 disabled:opacity-50"
                      disabled={currentPage === 1}
                    >
                      &#171; Prev
                    </button>
                    <span className="px-3 py-1 border rounded-md bg-gray-100">{currentPage} / {totalPages}</span>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className="px-3 py-1 border rounded-md hover:bg-gray-200 disabled:opacity-50"
                      disabled={currentPage === totalPages}
                    >
                      Next &#187;
                    </button>
                  </div>
                </td>
              </tr>
            </tfoot>


          </table>
        </CardBody>
      </Card>

      <Card className="h-full w-full">
        {/* <CardHeader floated={false} shadow={false} className="rounded-none"> */}
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex items-center justify-between gap-8">
            <div>
              <Typography variant="h6" color="white">
                Users list
              </Typography>
              <Typography color="white" className="mt-1 font-normal">
                Lihat Semua Informasi Siswa dan Guru.
              </Typography>
            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              {/* Tombol untuk membuka modal */}
              <Button onClick={handleOpen} className="flex items-center gap-3" size="sm">
                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add User
              </Button>
            </div>
          </div>

          {/* Modal Dialog */}
          <Dialog size="sm" open={open} handler={handleOpen} className="p-4">
            <DialogHeader className="relative m-0 block">
              <Typography variant="h4" color="blue-gray">
                Add New User
              </Typography>
              <Typography className="mt-1 font-normal text-gray-600">
                Fill in the details below to add a new user.
              </Typography>
              <IconButton
                size="sm"
                variant="text"
                className="!absolute right-3.5 top-3.5"
                onClick={handleOpen}
              >
                <XMarkIcon className="h-4 w-4 stroke-2" />
              </IconButton>
            </DialogHeader>

            <DialogBody className="space-y-4 pb-6">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                  Full Name
                </Typography>
                <Input
                  color="gray"
                  size="lg"
                  placeholder="Enter full name"
                  name="name"
                  className="placeholder:opacity-100 focus:!border-t-gray-900"
                  containerProps={{ className: "!min-w-full" }}
                  labelProps={{ className: "hidden" }}
                />
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                  Email
                </Typography>
                <Input
                  color="gray"
                  size="lg"
                  placeholder="Enter email"
                  name="email"
                  className="placeholder:opacity-100 focus:!border-t-gray-900"
                  containerProps={{ className: "!min-w-full" }}
                  labelProps={{ className: "hidden" }}
                />
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                  Role
                </Typography>
                <Input
                  color="gray"
                  size="lg"
                  placeholder="e.g. Admin, User, Guest"
                  name="role"
                  className="placeholder:opacity-100 focus:!border-t-gray-900"
                  containerProps={{ className: "!min-w-full" }}
                  labelProps={{ className: "hidden" }}
                />
              </div>
            </DialogBody>

            <DialogFooter>
              <Button variant="text" onClick={handleOpen} className="mr-2">
                Cancel
              </Button>
              <Button className="ml-auto" onClick={handleOpen}>
                Add User
              </Button>
            </DialogFooter>
          </Dialog>

        </CardHeader>
        {/* **FILTER DAN SEARCH** */}
        <div className="flex flex-col items-center justify-between mx-3 gap-4 md:flex-row">
          <Tabs value={selectedFilter} className="w-full md:w-max">
            <TabsHeader>
              {[
                { label: "All", value: "all" },
                { label: "Guru", value: "guru" },
                { label: "Siswa", value: "siswa" },
              ].map(({ label, value }) => (
                <Tab
                  key={value}
                  value={value}
                  onClick={() => {
                    console.log("Filter yang dipilih:", value);
                    setSelectedFilter(value);
                    setPageIndex(0);
                  }}
                >
                  {label}
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>


          <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPageIndex(0); }}
            />
          </div>
        </div>
        {/* </CardHeader> */}
        <CardBody className="overflow-hidden px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map(({ img, name, nis, nisn, email, role, isGuru, date }, index) => {
                const isLast = index === paginatedData.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={name}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar src={img} alt={name} size="sm" />
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {name}
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                          >
                            NIS: {nis}
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                          >
                            NISN: {nisn}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {email}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {role}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={isGuru ? "Guru" : "Siswa"}
                          color={isGuru ? "green" : "blue-gray"}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {date}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Edit User">
                        <IconButton variant="text">
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip content="Delete User">
                        <IconButton variant="text">
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              },
              )}
            </tbody>
          </table>
        </CardBody>
        {/* PAGINATION */}
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page {pageIndex + 1} of {Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm" disabled={pageIndex === 0} onClick={() => setPageIndex(pageIndex - 1)}>
              Previous
            </Button>
            <Button variant="outlined" size="sm" disabled={(pageIndex + 1) * ITEMS_PER_PAGE >= filteredData.length} onClick={() => setPageIndex(pageIndex + 1)}>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default History;
