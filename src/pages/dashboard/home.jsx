import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Tabs,
  TabsHeader,
  Tab,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
  UserIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
  ChevronDownIcon,
  UserCircleIcon,
  PhotoIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  // statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import Swal from 'sweetalert2';
import statisticsCardsData from "./../../data/statistics-cards-data";

export function Home() {

  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [riwayatAbsensi, setRiwayatAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Buat URL sementara untuk ditampilkan
    }
  };

  const [activeTab, setActiveTab] = useState("absen"); // Menyimpan tab yang aktif

  const [previewImage, setPreviewImage] = useState(null); // Nama const berbeda

  const [formData, setFormData] = useState({
    keterangan: '',
    description: '',
    suratIzin: null
  });


  const navigate = useNavigate(); // Hook untuk redirect
  const [userRole, setUserRole] = useState(null); // ✅ Tambahkan state untuk role
  const [swalShown, setSwalShown] = useState(false); // ✅ Tambahkan state untuk Swal
  // Tambahkan useEffect untuk mengambil data user
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedToken = localStorage.getItem("token");

        // ✅ Pastikan token ada sebelum dipakai
        if (!storedToken) {
          navigate("/auth/sign-in");
          return;
        }

        // ✅ Decode JWT untuk mendapatkan role
        const decodedToken = jwtDecode(storedToken);
        setUserRole(decodedToken.role);
        const userRole = decodedToken.role;

        const response = await fetch('/api/siswa/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.data);

          // ✅ Cek jika Swal belum pernah muncul
          if (!localStorage.getItem("swalShown")) {
            showWelcomeMessage(userRole);
            localStorage.setItem("swalShown", "true"); // ✅ Tandai Swal sudah muncul
          }
        }
        else {
          // Jika token tidak valid atau gagal fetch, redirect ke login
          navigate("/auth/sign-in");
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [navigate, swalShown]);

  const showWelcomeMessage = (role) => {
    const messages = {
      admin: { title: "Selamat Datang, Admin!", text: "Anda berhasil login sebagai admin." },
      siswa: { title: "Halo, Siswa!", text: "Selamat datang di dashboard siswa." },
      guru: { title: "Selamat Datang, Guru!", text: "Anda berhasil masuk sebagai guru." }
    };

    if (messages[role]) {
      Swal.fire({
        title: messages[role].title,
        text: messages[role].text,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, suratIzin: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitIzin = async (e) => {
    e.preventDefault();

    try {
      if (!userData) {
        throw new Error('Data siswa tidak tersedia');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('nisn', userData.nisn); // Tambahkan NISN
      formDataToSend.append('status', formData.keterangan === 'sakit' ? 'SAKIT' : 'IZIN');
      formDataToSend.append('keterangan', formData.description);
      if (formData.suratIzin) {
        formDataToSend.append('suratIzin', formData.suratIzin);
      }

      const response = await fetch('/api/absensi/izin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Berhasil!",
          text: "Izin berhasil disubmit",
          icon: "success",
          confirmButtonText: "OK"
        });

        // Reset form
        setFormData({
          keterangan: '',
          description: '',
          suratIzin: null
        });
        setPreviewImage(null);
      } else {
        throw new Error(result.message || 'Gagal submit izin');
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  useEffect(() => {
    const fetchRiwayatAbsensi = async () => {
      try {
        const response = await fetch("/api/absensi/riwayat", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch attendance history");
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

  const calculateAbsensi = (status) => {
    return riwayatAbsensi.filter(item => item.status === status).length;
  };

  // Update nilai kartu dengan data dinamis
  const updatedStatisticsCardsData = statisticsCardsData.map(card => {
    switch (card.title) {
      case "Kehadiran":
        return {
          ...card,
          value: `${calculateAbsensi("HADIR")} Hari`,
        };
      case "Sakit":
        return {
          ...card,
          value: `${calculateAbsensi("SAKIT")} Hari`,
        };
      case "Izin":
        return {
          ...card,
          value: `${calculateAbsensi("IZIN")} Hari`,
        };
      case "Alfa":
        return {
          ...card,
          value: `${calculateAbsensi("ALFA")} Hari`,
        };
      default:
        return card;
    }
  });


  return (
    <div className="mt-12">
      {userRole == "guru" &&
        <div className="bg-transparent p-6">
          <h1 className="text-2xl font-bold">Selamat Datang, {userData?.nama ||   <div className="h-3 bg-gray-200 rounded w-16"></div>} !</h1>
          <p className="text-gray-600">Anda adalah wali kelas {userData?.kelas ||   <div className="h-3 bg-gray-200 rounded w-16"></div>}</p>
        </div>
      }
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {updatedStatisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>



      {/* <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div> */}
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* <Card className="overflow-hidden xl:col-span-4 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Projects
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                <strong>30 done</strong> this month
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>Action</MenuItem>
                <MenuItem>Another Action</MenuItem>
                <MenuItem>Something else here</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["companies", "members", "budget", "completion"].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
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
                              color={completion === 100 ? "green" : "blue"}
                              className="h-1"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card> */}
        {/* <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Orders Overview
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>24%</strong> this month
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {ordersOverviewData.map(
              ({ icon, color, title, description }, key) => (
                <div key={title} className="flex items-start gap-4 py-3">
                  <div
                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                      key === ordersOverviewData.length - 1
                        ? "after:h-0"
                        : "after:h-4/6"
                    }`}
                  >
                    {React.createElement(icon, {
                      className: `!w-5 !h-5 ${color}`,
                    })}
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium"
                    >
                      {title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {description}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card> */}
      </div>

      <div className="w-full">
        <Tabs value={activeTab}>
          <TabsHeader>
            <Tab value="absen" onClick={() => setActiveTab("absen")}>
              <ClipboardDocumentCheckIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
              Absen
            </Tab>

            <Tab value="izin" onClick={() => setActiveTab("izin")}>
              <EnvelopeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
              Izin/Sakit
            </Tab>
          </TabsHeader>
        </Tabs>

        {activeTab === "absen" && (
          <>
            <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">

              <div className="absolute inset-0 h-full w-full bg-gray-100/75" />
            </div>
            <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
              <CardBody className="p-4">
                <div className="px-4 pb-4">
                  <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">

                      <div className="border-b border-gray-900/10 pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">



                          <div className="sm:col-span-3">
                            <label htmlFor="FormAbsen" className="block text-2xl font-medium text-gray-900 my-5">
                              Silahkan Absen
                            </label>

                          </div>
                        </div>
                      </div>

                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">


                        <div className="col-span-full">
                          <label htmlFor="qr" className="block text-sm/6 font-medium text-gray-900">
                            QR Code
                          </label>
                          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                              <div className="relative h-full w-full overflow-hidden">
                                <img
                                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAAAfxSURBVO3BQY4cQZIEQTVH/f/LNg3MgZcFMgYIZpcvVST9gSQtMEjSEoMkLTFI0hKDJC0xSNISgyQtMUjSEoMkLTFI0hIfDiVBf7TlRBKetOVEEk605UkSbmrLkyScaMvbknBLW04kQX+05ckgSUsMkrTEIElLDJK0xCBJSwyStMQgSUsMkrTEIElLfLisLZsl4aa23NKWt7XlRBKetOVEEk605UkSTrTlRBLe1pbNknDLIElLDJK0xCBJSwyStMQgSUsMkrTEIElLDJK0xCBJS3z4JUl4W1veloS3tWWzttzSlpva8o2S8La2vG2QpCUGSVpikKQlBklaYpCkJQZJWmKQpCUGSVrig/6qtjxJwk1J+EZJ+FZtOZGEJ23R3zFI0hKDJC0xSNISgyQtMUjSEoMkLTFI0hKDJC0xSNISH/RXJeFJW04k4W1JONGWJ0k40ZYTSXjSlhNJONEW/Z5BkpYYJGmJQZKWGCRpiUGSlhgkaYlBkpYYJGmJQZKW+PBL2vIvaMstbTmRhFva8rYkvK0tm7XlXzBI0hKDJC0xSNISgyQtMUjSEoMkLTFI0hKDJC3x4bIk6I8kPGnLiSScaMuTJNyUhCdtOZGEE215koQTbTmRhCdtuSkJ+q9BkpYYJGmJQZKWGCRpiUGSlhgkaYlBkpYYJGmJQZKWSH+gvyYJT9pyIgm3tGW7JNzSFn2/QZKWGCRpiUGSlhgkaYlBkpYYJGmJQZKWGCRpiUGSlkh/8I9Iwi1tuSUJJ9pyIglva4v+N0k40ZYnSTjRlhNJeNKWE0k40ZYngyQtMUjSEoMkLTFI0hKDJC0xSNISgyQtMUjSEh8uS8K3asvbkvCN2vK2JHyrttyShJuS8KQtN7XllrbcMkjSEoMkLTFI0hKDJC0xSNISgyQtMUjSEoMkLTFI0hIffklbniThbUk40ZZb2nJTW/4FbXmShBNJONGWJ205kYTNknCiLbcMkrTEIElLDJK0xCBJSwyStMQgSUsMkrTEIElLDJK0xIdDSXhbW97WlhNJONGWW5Jwoi23JOFEW25py7dKwpO2vC0JN7XlliScaMuTQZKWGCRpiUGSlhgkaYlBkpYYJGmJQZKWGCRpiQ9fLAk3teVJEm5KwpO2nGjLLUm4KQlvS8KTtrwtCW9ry4kkvK0ttwyStMQgSUsMkrTEIElLDJK0xCBJSwyStMQgSUsMkrTEh1+ShG/Ulm+VhFvaclMSnrTlX9CWE0m4JQkn2nJLW04k4URbngyStMQgSUsMkrTEIElLDJK0xCBJSwyStMQgSUsMkrTEh8vaciIJT9rytiTc1JbNknCiLW9ry5MknGjLLUk40ZYTSXjSlpuScEtbbhkkaYlBkpYYJGmJQZKWGCRpiUGSlhgkaYlBkpZIf/ALkvCN2nIiCSfa8rYkvK0ttyRhs7acSMKJtjxJwtvaciIJJ9ryZJCkJQZJWmKQpCUGSVpikKQlBklaYpCkJQZJWmKQpCXSHxxIwom23JKEm9ryJAkn2nJLEm5qy5MknGjLt0rCLW05kYRb2vKtknBLW24ZJGmJQZKWGCRpiUGSlhgkaYlBkpYYJGmJQZKWGCRpifQHB5JwU1tuScKJttyShBNt2SwJJ9ryJAkn2nIiCbe0ZbMknGjLLUm4qS1PBklaYpCkJQZJWmKQpCUGSVpikKQlBklaYpCkJT58sSScaMstSXhbEt7Wlre15UQSTrTlliScaMuTJLytLSeScEtbTiThlkGSlhgkaYlBkpYYJGmJQZKWGCRpiUGSlhgkaYlBkpZIf3AgCSfaciIJT9qyXRKetOVEEk605UkSbmrLkyS8rS3fKgkn2vIkCTe15UkSTrTllkGSlhgkaYlBkpYYJGmJQZKWGCRpiUGSlhgkaYlBkpb48MWS8K3a8i9oy4kkvK0tb0vC25JwS1veloQTbXkySNISgyQtMUjSEoMkLTFI0hKDJC0xSNISgyQtkf5Af00S3tYW/R1JeNKWtyXhprbckoQTbXkySNISgyQtMUjSEoMkLTFI0hKDJC0xSNISgyQtMUjSEh8OJUF/tOVEW25JwokkPGnLiSTc0pYTSfgXJOFEW25py4kkPGnL2wZJWmKQpCUGSVpikKQlBklaYpCkJQZJWmKQpCUGSVriw2Vt2SwJNyXhlrbckoQTbTmRhCdJONGWE0l40pabknBLW96WhBNteZKEtw2StMQgSUsMkrTEIElLDJK0xCBJSwyStMQgSUt8+CVJeFtb3taWJ0k4kYQTbbklCSfa8iQJJ5Jwoi23JOGWJOjvGCRpiUGSlhgkaYlBkpYYJGmJQZKWGCRpiUGSlhgkaYkP+nVtOZGEW9qiP9pyIglP2nJTEp605W1tedsgSUsMkrTEIElLDJK0xCBJSwyStMQgSUsMkrTEIElLfND/O0l40pYTSbilLSeScCIJT9ryrZJwSxJOtOWWJJxoyy2DJC0xSNISgyQtMUjSEoMkLTFI0hKDJC0xSNISH35JW/RfSTjRlhNJeJKEE205kYQnSbipLd8oCSfaciIJb0vCk7acSMKJtjwZJGmJQZKWGCRpiUGSlhgkaYlBkpYYJGmJQZKWGCRpiQ+XJUH6v7TlRBLeloS3JeFEWzZryy2DJC0xSNISgyQtMUjSEoMkLTFI0hKDJC0xSNISgyQtkf5AkhYYJGmJQZKWGCRpiUGSlhgkaYlBkpYYJGmJQZKW+A8GA05wSjv4zwAAAABJRU5ErkJggg=="
                                  alt="QR Code"
                                  className="w-[300px] h-[300px] object-fit"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </CardBody>
            </Card>
          </>
        )}

        {activeTab === "izin" && (
          <>
            <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
              <div className="absolute inset-0 h-full w-full bg-gray-100/75" />
            </div>
            <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
              <CardBody className="p-4">


                <div className="px-4 pb-4">

                  <form onSubmit={handleSubmitIzin}>
                    <div className="space-y-12">
                      <div className="border-b border-gray-900/10 pb-12">

                        <div className="border-b border-gray-900/10 pb-12">
                          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">



                            <div className="sm:col-span-3">
                              <label htmlFor="FormIzin" className="block text-2xl font-medium text-gray-900 my-5">
                                Form Izin
                              </label>
                              <label htmlFor="keterangan" className="block text-sm/6 font-medium text-gray-900">
                                Keterangan
                              </label>
                              <div className="relative mt-2 w-full">
                                <select
                                  id="keterangan"
                                  name="keterangan"
                                  value={formData.keterangan}
                                  onChange={handleInputChange}
                                  className="peer w-full rounded-md border border-gray-300 bg-white py-1.5 px-3 text-gray-900"
                                  required
                                >
                                  <option value="" disabled>Pilih Keterangan</option>
                                  <option value="sakit">Izin Sakit</option>
                                  <option value="keperluan">Izin Keperluan</option>
                                </select>
                                <ChevronDownIcon
                                  aria-hidden="true"
                                  className="absolute right-3 top-1/2 w-3 h-3 -translate-y-1/2 text-gray-500 peer-focus:text-indigo-600"
                                />
                              </div>
                            </div>

                            <div className="col-span-full">
                              <label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">
                                Keperluan Izin (Deskripsikan)
                              </label>
                              <div className="mt-2">
                                <input
                                  id="description"
                                  name="description"
                                  type="text"
                                  value={formData.description}
                                  onChange={handleInputChange}
                                  className="block w-full rounded-md border border-gray-400 px-3 py-1.5"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">


                          <div className="col-span-full">
                            <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-gray-900">
                              Sertakan Surat Izin
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
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
                      >
                        Submit Izin
                      </button>
                    </div>
                  </form>
                </div>
              </CardBody>
            </Card>
          </>
        )}

      </div>
    </div>
  );
}

export default Home;
