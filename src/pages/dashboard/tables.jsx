import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
  Button,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "@/data";
import { useState, useEffect, useRef } from "react";
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

export function Tables() {
  const [riwayatAbsensi, setRiwayatAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const navigate = useNavigate(); // Hook untuk redirect
  const [userRole, setUserRole] = useState(null); // ✅ Tambahkan state untuk role
  const galleryRef = useRef(null);
  const [kelasInfo, setKelasInfo] = useState({
    kelas: '',
    tahun: new Date().getFullYear()
  });

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
                              {absen.kelas}
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
    </div>
  );
}

export default Tables;
