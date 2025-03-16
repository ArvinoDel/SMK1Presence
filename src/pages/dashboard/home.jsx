import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import JsBarcode from "jsbarcode";
import QRCode from "react-qr-code";
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
import { API_BASE_URL } from "@/config";

// Polyfill untuk getUserMedia yang lebih universal
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

// Fungsi helper untuk mengecek dukungan kamera yang lebih komprehensif
const checkCameraSupport = () => {
  return !!(
    (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia ||
    navigator.getUserMedia
  );
};

// Fungsi untuk mendapatkan stream kamera dengan fallback yang lebih robust
const getCameraStream = async (constraints) => {
  try {
    // Coba menggunakan API standar terlebih dahulu
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return await navigator.mediaDevices.getUserMedia(constraints);
    }

    // Fallback untuk browser lama
    const getUserMedia = (
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia
    );

    if (!getUserMedia) {
      throw new Error('Browser tidak mendukung akses kamera');
    }

    // Wrap dalam Promise untuk API lama
    return new Promise((resolve, reject) => {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  } catch (error) {
    console.error('Error accessing camera:', error);
    throw error;
  }
};

// Fungsi untuk mendapatkan constraints kamera yang optimal
const getVideoConstraints = (facingMode = 'environment') => ({
  facingMode,
  width: { ideal: 1280 },
  height: { ideal: 720 }
});

// Fungsi untuk mengecek dan meminta izin kamera
const requestCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (err) {
    console.error('Error checking camera permission:', err);
    return false;
  }
};

export function Home() {

  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [riwayatAbsensi, setRiwayatAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [time, setTime] = useState("");
  const [dateString, setDateString] = useState("");
  const [greeting, setGreeting] = useState("");
  const [dayName, setDayName] = useState("");

  const [scannedData, setScannedData] = useState(null);
  const [deviceId, setDeviceId] = useState("");
  const webcamRef = useRef(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const [activeTab, setActiveTab] = useState("absen"); // Menyimpan tab yang aktif

  const [previewImage, setPreviewImage] = useState(null); // Nama const berbeda

  const [formData, setFormData] = useState({
    keterangan: '',
    description: '',
    suratIzin: null
  });

  const navigate = useNavigate(); // Hook untuk redirect
  const [userRole, setUserRole] = useState(null); // ✅ Tambahkan state untuk role
  const [nisn, setNisn] = useState(""); // State untuk menyimpan NISN siswa
  const [swalShown, setSwalShown] = useState(false); // ✅ Tambahkan state untuk Swal
  // Tambahkan useEffect untuk mengambil data user
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          navigate("auth/sign-in");
          return;
        }

        // Decode JWT Token
        const decodedToken = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          navigate("auth/sign-in");
          return;
        }

        setUserRole(decodedToken.role);
        const userRole = decodedToken.role;
        let apiUrl;

        switch (userRole) {
          case "siswa":
            apiUrl = `${API_BASE_URL}/api/siswa/profile`;
            break;
          case "guru":
            apiUrl = `${API_BASE_URL}/api/guru/profile`;
            break;
          case "admin":
            apiUrl = `${API_BASE_URL}/api/admin/profile`;
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

        const data = await response.json();
        setUserData(data.data);

        // Simpan NISN jika user adalah siswa
        if (userRole === "siswa" && data.data.nisn) {
          setNisn(data.data.nisn);
        }

        if (!localStorage.getItem("swalShown")) {
          showWelcomeMessage(userRole);
          localStorage.setItem("swalShown", "true");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/auth/sign-in");
      }
    };

    fetchUserData();
  }, [navigate]);

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

  useEffect(() => {
    // Hanya jalankan kode kamera jika user adalah guru
    if (userRole === "guru") {
      const setupCamera = async () => {
        try {
          // Cek apakah browser mendukung getUserMedia
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Browser tidak mendukung akses kamera');
          }

          // Minta izin kamera terlebih dahulu
          const hasPermission = await requestCameraPermission();
          if (!hasPermission) {
            throw new Error('Izin kamera ditolak');
          }

          // Coba akses kamera belakang terlebih dahulu
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: getVideoConstraints('environment')
            });

            if (webcamRef.current && webcamRef.current.video) {
              webcamRef.current.video.srcObject = stream;
            }
          } catch (backCameraError) {
            console.log('Mencoba menggunakan kamera depan...', backCameraError);

            // Jika kamera belakang gagal, coba kamera depan
            try {
              const frontStream = await navigator.mediaDevices.getUserMedia({
                video: getVideoConstraints('user')
              });

              if (webcamRef.current && webcamRef.current.video) {
                webcamRef.current.video.srcObject = frontStream;
              }
            } catch (frontCameraError) {
              console.error('Error accessing front camera:', frontCameraError);
              throw new Error('Gagal mengakses kamera depan dan belakang');
            }
          }
        } catch (err) {
          console.error("Error in camera setup:", err);
          Swal.fire({
            icon: 'error',
            title: 'Gagal Mengakses Kamera',
            text: 'Pastikan browser mendukung kamera dan izin kamera diberikan. Coba refresh halaman atau gunakan browser lain.',
            confirmButtonText: 'OK'
          });
        }
      };

      setupCamera();

      // Cleanup function
      return () => {
        if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.srcObject) {
          const tracks = webcamRef.current.video.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }
      };
    }
  }, [userRole]);

  const scanBarcode = () => {
    if (userRole !== "guru") return;

    if (webcamRef.current && webcamRef.current.video) {
      const video = webcamRef.current.video;
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            setScannedData(code.data);
            sendToBackend(code.data);
          }
        } catch (err) {
          console.error("Error scanning QR code:", err);
        }
      }
    }
  };

  const sendToBackend = async (qrData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/absensi/scan-qr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ qrData }),
      });
      const result = await response.json();
      if (result.success) {
        // Get current time in HH:mm:ss format
        const currentTime = new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        // Show success message with SweetAlert2
        Swal.fire({
          icon: "success",
          title: "Berhasil Absensi!",
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <img src="${result.data.photo || '../img/team-1.jpeg'}" 
                   alt="Foto Siswa" 
                   style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 15px;">
              <strong style="font-size: 18px; color: #2c3e50;">${result.data.nama}</strong>
              <p style="margin: 5px 0; font-size: 16px; color: #444;">Kelas: <b>${result.data.kelas}</b></p>
              <p style="margin: 5px 0; font-size: 16px; color: #444;">Status: <b>${result.data.status}</b></p>
              <p style="margin-top: 10px; font-size: 15px; color: #555;">Waktu: ${currentTime}</p>
            </div>
          `,
          showConfirmButton: false,
          timer: 3000,
        });


      } else {
        // Show detailed error message with Swal
        let errorMessage = " Error: " + result.message;
        let iconType = "error";

        if (result.message.includes("sudah")) {
          errorMessage = `⚠️ ${result.message}<br>Siswa sudah melakukan absensi hari ini`;
          iconType = "warning";
        } else if (result.message.includes("tidak ditemukan")) {
          errorMessage = " Error: Siswa tidak ditemukan dalam database";
        }

        Swal.fire({
          icon: iconType,
          title: "Oops!",
          html: errorMessage,
          confirmButtonColor: "#d33",
          timer: 2000, // Timer 2 detik (2000ms)
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error sending QR data:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "❌ Error: Gagal memproses absensi. Silakan coba lagi.",
        timer: 2000, // Timer 2 detik (2000ms)
        showConfirmButton: false,
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(scanBarcode, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      // Format waktu dalam zona Asia/Jakarta
      const formattedTime = now.toLocaleTimeString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour12: false,
      });

      setTime(formattedTime);

      // Ambil jam saja (format 24 jam)
      const hour = now.toLocaleTimeString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        hour12: false,
      });

      // Tentukan greeting berdasarkan jam
      if (hour >= 3 && hour <= 10) setGreeting("Selamat Pagi");
      else if (hour >= 11 && hour <= 14) setGreeting("Selamat Siang");
      else if (hour >= 15 && hour <= 18) setGreeting("Selamat Sore");
      else setGreeting("Selamat Malam");

      // Ambil hari, tanggal, bulan (dalam huruf), dan tahun
      const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];

      const day = days[now.getDay()];
      const date = now.getDate();
      const month = months[now.getMonth()];
      const year = now.getFullYear();

      setDayName(day);
      setDateString(`${day}, ${date} ${month} ${year}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleTabClick = () => {
    if (dayName === "Sabtu" || dayName === "Minggu") {
      Swal.fire({
        icon: "warning",
        title: "Hari Libur!",
        text: "Anda tidak bisa mengakses ini di hari libur!",
        timer: 4000, // Timer 2 detik (2000ms)
        showConfirmButton: false,
      });
      return;
    }
    // Lakukan sesuatu jika tab diizinkan
    setActiveTab("izin")
  };



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Buat URL sementara untuk ditampilkan
    }
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    let file;

    if (e.type === "drop") {
      file = e.dataTransfer.files[0]; // Mengambil file dari event drop
    } else {
      file = e.target.files[0]; // Mengambil file dari input
    }

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

      const response = await fetch(`${API_BASE_URL}/api/absensi/izin`, {
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
          text: "Izin berhasil dikirim!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
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
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  useEffect(() => {
    const fetchRiwayatAbsensi = async () => {
      try {

        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
          navigate("auth/sign-in");
          return;
        }

        // Decode JWT untuk mendapatkan role
        const decodedToken = jwtDecode(storedToken);
        setUserRole(decodedToken.role);
        const userRole = decodedToken.role;

        let response;
        if (userRole === "siswa") {
          response = await fetch(`${API_BASE_URL}/api/absensi/riwayat`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
        } else if (userRole === "guru") {
          // response = await fetch("http://localhost:3000/api/guru/profile", {
          //   headers: { Authorization: `Bearer ${storedToken}` },
          // });
        } else if (userRole === "admin") {
          // response = await fetch("http://localhost:3000/api/admin/profile", {
          //   headers: { Authorization: `Bearer ${storedToken}` },
          // });
        }

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

  const barcodeRef = useRef(null);
  const barcodeModalRef = useRef(null);


  useEffect(() => {
    if (nisn && barcodeRef.current) {
      JsBarcode(barcodeRef.current, nisn, {
        format: "CODE128",
        width: 2,
        height: 100,
        displayValue: true,
      });
    }
  }, [nisn]);

  useEffect(() => {
    if (isOpened && nisn && barcodeModalRef.current) {
      setTimeout(() => {  // Tambahkan sedikit delay agar canvas ter-render
        JsBarcode(barcodeModalRef.current, nisn, {
          format: "CODE128",
          width: 2,
          height: 150, // Bisa diperbesar untuk modal
          displayValue: true,
        });
      }, 100);
    }
  }, [isOpened, nisn]);



  // Update nilai kartu dengan data dinamis
  const updatedStatisticsCardsData = statisticsCardsData.map(card => {
    switch (card.title) {
      case "Kehadiran":
        return {
          ...card,
          value: `${calculateAbsensi("HADIR") + calculateAbsensi("TERLAMBAT")} Hari`,
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
    <div className="mt-3">
      <div className="flex flex-col items-right justify-right text-black">
        {/* Hari + Tanggal */}
        <span className="text-xl font-medium">{dateString}</span>
        <span className="text-3xl font-bold">{time}<span className="text-xl font-bold">WIB</span></span>
      </div>
      {/* <iframe
        style={{ borderRadius: "12px" }}
        src="https://open.spotify.com/embed/playlist/37i9dQZF1FoOkwqHhdNOkk?utm_source=generator"
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        loading="lazy"
      /> */}
      {userRole == "guru" &&
        <div className="bg-transparent p-6">
          <h1 className="text-2xl font-bold">{greeting}, {userData?.nama || <div className="h-3 bg-gray-200 rounded w-16"></div>} !</h1>
          <p className="text-gray-600">Anda adalah wali kelas {userData?.kelas || <div className="h-3 bg-gray-200 rounded w-16"></div>}</p>
        </div>
      }
      {userRole == "siswa" &&
        <div className="bg-transparent p-6">
          <h1 className="text-2xl font-bold">Halo, {greeting} {userData?.nama || <div className="h-3 bg-gray-200 rounded w-16"></div>} !</h1>
          <p className="text-gray-600">Selamat Belajar, dan Semoga Sukses!</p>
        </div>
      }
      {userRole == "admin" &&
        <div className="bg-transparent p-6">
          <h1 className="text-2xl font-bold">Halo, {greeting} {userData?.nama || <div className="h-3 bg-gray-200 rounded w-16"></div>} !</h1>
          <p className="text-gray-600">Selamat Datang, Administrator!</p>
        </div>
      }
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {updatedStatisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white shadow-lg",
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

            {/* Tab hanya muncul untuk siswa */}
            {userRole === "siswa" && (
              <Tab
                value="izin"
                onClick={handleTabClick}
                disabled={dayName === "Sabtu" || dayName === "Minggu"}
                className={`${dayName === "Sabtu" || dayName === "Minggu" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <EnvelopeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                Izin/Sakit
              </Tab>
            )}
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
                              {userRole === "siswa" ? "Silahkan Absen" : userRole === "guru" ? "Silahkan Menginput Absen" : userRole === "admin" ? "Administrator SMKN 1 Cirebon" : <div className="h-3 bg-gray-200 rounded w-16"></div>}
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="col-span-full border-b border-gray-900/10 pb-12">
                          <label htmlFor="qr" className="block text-sm/6 font-medium text-gray-900">
                            {userRole === "siswa" ? "QR Code" : userRole === "guru" ? "Scan QR Code" : userRole === "admin" ? "Administrator SMKN 1 Cirebon" : <div className="h-3 bg-gray-200 rounded w-16"></div>}
                          </label>

                          {userRole === "guru" && (
                            <div className="flex flex-col items-center rounded-lg justify-center my-10">
                              {/* Kamera Scanner */}
                              <div className="relative w-80 h-80 bg-black rounded-lg overflow-hidden shadow-lg">
                                <Webcam
                                  ref={webcamRef}
                                  className="absolute top-0 left-0 w-full h-full object-cover"
                                />

                                {/* Border Scanner */}
                                <div className="absolute inset-0 border-4 border-gray-100 rounded-lg pointer-events-none">
                                  {/* Sudut Atas Kiri */}
                                  <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-green-500"></div>
                                  {/* Sudut Atas Kanan */}
                                  <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-green-500"></div>
                                  {/* Sudut Bawah Kiri */}
                                  <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-green-500"></div>
                                  {/* Sudut Bawah Kanan */}
                                  <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-green-500"></div>
                                </div>
                              </div>

                              {/* Hasil Scan */}
                              {scannedData && (
                                <div className="mt-6 p-4 w-80 bg-white shadow-lg text-center rounded-lg border border-gray-200">
                                  <h2 className="text-lg font-semibold text-gray-800">Absen Berhasil!</h2>
                                  <p className="text-md text-green-700 break-words">NIS: {scannedData}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {userRole === "siswa" && nisn && (
                            <>
                              {/* Parent div yang bisa diklik untuk zoom-in */}
                              <div
                                className="mt-6 flex flex-col items-center p-6 border border-gray-300 rounded-2xl shadow-lg bg-white max-w-sm sm:max-w-md md:max-w-lg mx-auto cursor-pointer"
                                onClick={() => setIsZoomed(true)}
                              >
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Kode QR Anda</h2>

                                {/* QR Code responsif */}
                                <div className="p-4">
                                  <QRCode value={nisn} size={200} className="mx-auto sm:size-[250px] md:size-[300px]" />
                                </div>

                                <p className="mt-4 text-lg font-medium text-gray-700">
                                  NISN: <span className="text-blue-600">{nisn}</span>
                                </p>
                              </div>

                              {/* Overlay zoom-in saat diklik */}
                              {isZoomed && (
                                <div
                                  className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
                                  onClick={() => setIsZoomed(false)} // Klik di luar = close
                                >
                                  {/* Container untuk QR dan tombol close */}
                                  <div
                                    className="relative bg-white p-6 rounded-2xl shadow-xl"
                                    onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam QR menutup overlay
                                  >
                                    {/* Tombol Close */}
                                    <button
                                      className="absolute top-1 right-1 text-gray-600 hover:text-gray-900 text-3xl font-bold"
                                      onClick={() => setIsZoomed(false)}
                                    >
                                      &times;
                                    </button>

                                    {/* QR Code besar */}
                                    <QRCode value={nisn} size={350} className="mx-auto" />
                                  </div>
                                </div>
                              )}

                            </>
                          )}
                        </div>
                        <div className="col-span-full">
                          {userRole === "siswa" && nisn && (
                            <>
                              <label htmlFor="qr" className="block text-sm/6 font-medium text-gray-900">
                                {userRole === "siswa" ? "Barcode" : <div className="h-3 bg-gray-200 rounded w-16"></div>}
                              </label>


                              <div
                                className="mt-6 flex flex-col items-center p-6 border border-gray-300 rounded-2xl shadow-lg bg-white max-w-sm sm:max-w-md md:max-w-lg mx-auto cursor-pointer"
                                onClick={() => setIsOpened(true)}
                              >
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Barcode Anda</h2>

                                {/* QR Code responsif */}
                                <div className="p-4">
                                  <canvas ref={barcodeRef}></canvas>
                                </div>

                                <p className="mt-4 text-lg font-medium text-gray-700">
                                  NISN: <span className="text-blue-600">{nisn}</span>
                                </p>
                              </div>

                              {/* Overlay zoom-in saat diklik */}
                              {isOpened && (
                                <div
                                  className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
                                  onClick={() => setIsOpened(false)} // Klik di luar = close
                                >
                                  {/* Container untuk QR dan tombol close */}
                                  <div
                                    className="relative bg-white p-6 rounded-2xl shadow-xl"
                                    onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam QR menutup overlay
                                  >
                                    {/* Tombol Close */}
                                    <button
                                      className="absolute top-1 right-1 text-gray-600 hover:text-gray-900 text-3xl font-bold"
                                      onClick={() => setIsOpened(false)}
                                    >
                                      &times;
                                    </button>

                                    {/* Barcode besar */}
                                    <canvas ref={barcodeModalRef} className="mx-auto w-[500px] h-[300px]"></canvas>

                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </CardBody>
            </Card>
          </>
        )}

        {userRole === "siswa" && (
          <>
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
                                    {/* <ChevronDownIcon
                                      aria-hidden="true"
                                      className="absolute right-3 top-1/2 w-3 h-3 -translate-y-1/2 text-gray-500 peer-focus:text-indigo-600"
                                    /> */}
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
                                <div
                                  className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                                  onDragOver={(e) => e.preventDefault()} // Mencegah perilaku default browser
                                  onDrop={handleImageChange} // Menangani drop event
                                >
                                  <div className="text-center">
                                    <div
                                      className="border-gray-300 p-6 rounded-md text-center cursor-pointer hover:bg-gray-50"
                                      onClick={() => document.getElementById("image-upload-input").click()}
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
                                            name="image-upload"
                                            type="file"
                                            className="sr-only"
                                            required
                                            accept="image/*"
                                            onChange={handleImageChange} // Handler untuk klik input
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
          </>
        )}

      </div>
    </div>
  );
}

export default Home;
