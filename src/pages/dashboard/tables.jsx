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
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';


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



export function Tables() {
  const [riwayatAbsensi, setRiwayatAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  // const openModal = (src) => {
  //   setImageSrc(src);
  //   setIsOpen(true);
  // };

  const galleryRef = useRef(null);



  useEffect(() => {
    const fetchRiwayatAbsensi = async () => {
      try {
        const response = await fetch('/api/absensi/riwayat', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch attendance history');
        }

        const result = await response.json();
        setRiwayatAbsensi(result.data);
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
        return 'red';
      case 'IZIN':
        return 'blue';
      case 'SAKIT':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getPhotoUrl = (photo) => {
    if (!photo) return "https://www.gravatar.com/avatar/?d=mp";
    if (photo.startsWith('http')) return photo;
    return `/uploads/${photo.split('/').pop()}`; // Ambil nama file saja
  };

  if (loading) return SkeletonRow();
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
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
                ? Array.from({ length: 5 }).map((_, index) => <SkeletonRow key={index} />)
                : riwayatAbsensi.map((absen, key) => {
                  const className = `py-3 px-5 ${key === riwayatAbsensi.length - 1 ? "" : "border-b border-blue-gray-50"}`;

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
                            data-pswp-src={absen.suratIzin}
                            data-pswp-width="800"
                            data-pswp-height="1000"
                          >
                            <img src={absen.suratIzin} alt="Surat Izin" className="w-12 h-12 rounded cursor-pointer shadow" />
                          </a>
                        ) : (
                          <Typography className="text-xs font-semibold text-gray-600">-</Typography>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>


          </table>
        </CardBody>
      </Card>
      {/* <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Projects Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["companies", "members", "budget", "completion", ""].map(
                  (el) => (
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
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {projectsTableData.map(
                ({ img, name, members, budget, completion }, key) => {
                  const className = `py-3 px-5 ${key === projectsTableData.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                    }`;

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar src={img} alt={name} size="sm" />
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {name}
                          </Typography>
                        </div>
                      </td>
                      <td className={className}>
                        {members.map(({ img, name }, key) => (
                          <Tooltip key={name} content={name}>
                            <Avatar
                              src={img}
                              alt={name}
                              size="xs"
                              variant="circular"
                              className={`cursor-pointer border-2 border-white ${key === 0 ? "" : "-ml-2.5"
                                }`}
                            />
                          </Tooltip>
                        ))}
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          className="text-xs font-medium text-blue-gray-600"
                        >
                          {budget}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="w-10/12">
                          <Typography
                            variant="small"
                            className="mb-1 block text-xs font-medium text-blue-gray-600"
                          >
                            {completion}%
                          </Typography>
                          <Progress
                            value={completion}
                            variant="gradient"
                            color={completion === 100 ? "green" : "gray"}
                            className="h-1"
                          />
                        </div>
                      </td>
                      <td className={className}>
                        <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                        >
                          <EllipsisVerticalIcon
                            strokeWidth={2}
                            className="h-5 w-5 text-inherit"
                          />
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card> */}
    </div>
  );
}

export default Tables;
