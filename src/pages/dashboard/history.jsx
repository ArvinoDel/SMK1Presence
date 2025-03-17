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
  Select,
  Option,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon, TrashIcon, XMarkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "@/data";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { API_BASE_URL, UPLOADS_BASE_URL } from "@/config";


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

const TABLE_HEAD = ["Users", "Email", "Kelas", "Mata Pelajaran", "Status", "Dibuat", "Action"];

export function History() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nama: '',
    email: '',
    role: '',
    nis: '',
    nisn: '',
    nip: '',
    kelas: '',
    mataPelajaran: '',
    password: ''
  });

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setEditFormData({
      nama: user.nama,
      email: user.email,
      role: user.isGuru ? 'guru' : 'siswa',
      nis: user.nis || '',
      nisn: user.nisn || '',
      nip: user.nip || '',
      kelas: user.kelas || '',
      mataPelajaran: user.mataPelajaran || '',
      password: ''
    });
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedUser(null);
    setEditFormData({
      nama: '',
      email: '',
      role: '',
      nis: '',
      nisn: '',
      nip: '',
      kelas: '',
      mataPelajaran: '',
      password: ''
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const storedToken = localStorage.getItem("token");
      const endpoint = `${API_BASE_URL}/api/admin/users/${selectedUser._id}`;
      const payload = {
        role: editFormData.role,
        nama: editFormData.nama,
        email: editFormData.email,
        ...(editFormData.role === 'siswa' ? {
          nis: editFormData.nis,
          nisn: editFormData.nisn,
          kelas: editFormData.kelas
        } : {
          nip: editFormData.nip,
          mataPelajaran: editFormData.mataPelajaran
        })
      };

      if (editFormData.password) {
        payload.password = editFormData.password;
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update user');
      }

      // Close modal and refresh data
      handleCloseEdit();
      fetchData();

      // Show success message
      Swal.fire({
        title: 'Success!',
        text: 'User has been updated successfully',
        icon: 'success',
        timer: 2000, // Timer 2 detik (2000ms)
        showConfirmButton: false,
      });

    } catch (error) {
      console.error('Error updating user:', error);
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        timer: 2000, // Timer 2 detik (2000ms)
        showConfirmButton: false,
      });
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "User ini akan dihapus secara permanen!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        const storedToken = localStorage.getItem("token");
        const endpoint = `${API_BASE_URL}/api/admin/users/${user._id}?role=${user.isGuru ? 'guru' : 'siswa'}`;

        const response = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        // Refresh data
        fetchData();

        Swal.fire({
          title: "Terhapus!",
          text: "User telah dihapus.",
          icon: "success"
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        timer: 2000, // Timer 2 detik (2000ms)
        showConfirmButton: false,
      });
    }
  };

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

  const kelasList = ["XII RPL 2", "XII RPL 1", "XII TOI 1", "XII TJKT 1", "XII DPIB 3", "XII TKR 1"];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [pageIndex, setPageIndex] = useState(0); // Index halaman tanpa state global

  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'siswa', // default role
    nis: '',
    nisn: '',
    nip: '',
    kelas: '',
    mataPelajaran: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const storedToken = localStorage.getItem("token");
      let payload;

      // Prepare payload
      if (formData.role === 'siswa') {
        payload = {
          role: 'siswa',
          nis: formData.nis,
          nisn: formData.nisn,
          nama: formData.nama,
          email: formData.email,
          password: formData.password,
          kelas: formData.kelas
        };
      } else if (formData.role === 'guru') {
        payload = {
          role: 'guru',
          nip: formData.nip,
          nama: formData.nama,
          email: formData.email,
          password: formData.password,
          mataPelajaran: formData.mataPelajaran,
          kelas: formData.kelas
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add user');
      }

      // Reset form and close dialog
      setFormData({
        nama: '',
        email: '',
        password: '',
        role: 'siswa',
        nis: '',
        nisn: '',
        nip: '',
        kelas: '',
        mataPelajaran: ''
      });
      handleOpen();

      // Refresh user list
      fetchData();

      // Show success message
      Swal.fire({
        title: 'Success!',
        text: 'User has been added successfully',
        icon: 'success',
        timer: 2000, // Timer 2 detik (2000ms)
        showConfirmButton: false,
      });

    } catch (error) {
      console.error('Error adding user:', error);
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        timer: 2000, // Timer 2 detik (2000ms)
        showConfirmButton: false,
      });
    }
  };

  // **🔍 Filter Data Berdasarkan Role dan Search Query**
  const filteredData = useMemo(() => {
    if (userRole === "admin") {
      return users.filter((user) => {
        const query = searchQuery.toLowerCase();

        // **Filter Berdasarkan Role**
        const matchRole =
          selectedFilter === "all" ||
          (selectedFilter === "guru" && user.isGuru === true) ||
          (selectedFilter === "siswa" && user.isGuru === false);

        // **Filter Berdasarkan Search Query**
        const matchSearch =
          user.nama.toLowerCase().includes(query) ||
          (user.email && user.email.toLowerCase().includes(query)) ||
          (user.nis && user.nis.toLowerCase().includes(query)) ||
          (user.nip && user.nip.toLowerCase().includes(query));

        // **Gabungkan Kedua Filter**
        return matchRole && matchSearch;
      });
    }
    return riwayatAbsensi.filter((user) => {
      const query = searchQuery.toLowerCase();

      // **Filter Berdasarkan Role**
      const matchRole =
        selectedFilter === "all" ||
        (selectedFilter === "guru" && user.isGuru === true) ||
        (selectedFilter === "siswa" && user.isGuru === false);

      // **Filter Berdasarkan Search Query**
      const matchSearch =
        user.nama.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      // **Gabungkan Kedua Filter**
      return matchRole && matchSearch;
    });
  }, [searchQuery, selectedFilter, riwayatAbsensi, users, userRole]);


  // **📌 Pagination: Ambil data berdasarkan halaman**
  const paginatedData = useMemo(() => {
    const start = pageIndex * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, pageIndex]);

  const fetchData = async () => {
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
          apiUrl = `${API_BASE_URL}/api/absensi/riwayat`;
          break;
        case "guru":
          apiUrl = `${API_BASE_URL}/api/absensi/wali-kelas/riwayat`;
          break;
        case "admin":
          apiUrl = `${API_BASE_URL}/api/admin/users`;
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
      } else if (userRole === "siswa") {
        setRiwayatAbsensi(result.data);
      } else if (userRole === "admin") {
        setUsers(result.data);
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
    return `${UPLOADS_BASE_URL}/suratizin/${photo.split('/').pop()}`;
  };

  useEffect(() => {
    const fetchKelasInfo = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/guru/profile`, {
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

  const getProfilePhotoUrl = (photo) => {
    if (!photo) return "https://www.gravatar.com/avatar/?d=mp";
    if (photo.startsWith('http')) return photo;
    if (photo.startsWith('/uploads')) return `${API_BASE_URL}${photo}`;
    return `${API_BASE_URL}/uploads/profilepicture/${photo}`;
  };

  const [kelasAbsensi, setKelasAbsensi] = useState([]);

  // Function to fetch attendance data grouped by class
  const fetchKelasAbsensi = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/absensi/per-kelas`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setKelasAbsensi(result.data);
      }
    } catch (error) {
      console.error('Error fetching kelas absensi:', error);
    }
  };

  // Update useEffect to remove selectedDate dependency
  useEffect(() => {
    fetchData();
    fetchKelasAbsensi();
  }, [currentPage, searchQuery, selectedFilter]);

  const [selectedKelas, setSelectedKelas] = useState(null);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);

  // Function to group attendance records by date and include all students
  const groupAbsensiByDate = (detailSiswa, allStudents) => {
    if (!Array.isArray(detailSiswa) || !Array.isArray(allStudents)) {
      console.error('Invalid parameters passed to groupAbsensiByDate');
      return {};
    }

    const grouped = {};

    // First, group existing attendance records by date
    detailSiswa.forEach(record => {
      if (!record || !record.tanggal || !record.siswa || !record.siswa.nis) return;

      const date = new Date(record.tanggal).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!grouped[date]) {
        grouped[date] = {};
      }
      grouped[date][record.siswa.nis] = record;
    });

    // Convert to array format with all students
    const result = {};
    Object.keys(grouped).forEach(date => {
      result[date] = allStudents.map(student => {
        if (!student || !student.nis) return null;
        return grouped[date][student.nis] || {
          siswa: student,
          status: 'ALFA',
          jamMasuk: null,
          keterangan: 'Tidak hadir tanpa keterangan'
        };
      }).filter(Boolean);
    });

    return result;
  };

  if (loading) return SkeletonRow();
  if (error) return <div>Error: {error}</div>;

  const baseUrl = `${API_BASE_URL}/api/absensi/rekapan-semester/download`;

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

      {userRole !== "admin" && (
        <>
          <Card>
            <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
              <Typography variant="h6" color="white">
                Riwayat Absensi
              </Typography>
            </CardHeader>
            <CardBody className="lg:overflow-hidden overflow-x-scroll px-0 pt-0 pb-2">
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
                                src={getProfilePhotoUrl(absen.photo)}
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
                            <Typography className="text-xs font-semibold text-blue-gray-600">{absen.jamMasuk === null ? '-' : absen.jamMasuk}</Typography>
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
                                        : `${UPLOADS_BASE_URL}/suratizin/${absen.suratIzin.split('/').pop()}`;

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
                                      `${UPLOADS_BASE_URL}/suratizin/${absen.suratIzin.split('/').pop()}`
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
        </>
      )}

      {userRole === "admin" && (
        <div className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl">
          <Typography variant="h6" color="dark" className="text-xl font-semibold">
            Unduh Rekapan Absensi
          </Typography>

          <div className="flex flex-wrap gap-3 mt-4">
            {kelasList.map((kelas) => (
              <Button
                key={kelas}
                variant="gradient"
                className="w-full sm:w-auto px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300"
              // onClick={async () => {
              //   const storedToken = localStorage.getItem("token");
              //   const encodedKelas = encodeURIComponent(kelas);
              //   const url = `${baseUrl}?kelas=${encodedKelas}&tahun=${tahun}`;

              //   try {
              //     const response = await fetch(url, {
              //       headers: {
              //         Authorization: `Bearer ${storedToken}`
              //       }
              //     });

              //     if (!response.ok) throw new Error('Download gagal');

              //     const blob = await response.blob();
              //     const downloadUrl = window.URL.createObjectURL(blob);
              //     const link = document.createElement('a');
              //     link.href = downloadUrl;
              //     link.download = `rekapan_${kelas}_${tahun}.xlsx`;
              //     document.body.appendChild(link);
              //     link.click();
              //     document.body.removeChild(link);
              //     window.URL.revokeObjectURL(downloadUrl);
              //   } catch (error) {
              //     console.error('Error:', error);
              //   }
              // }}
              >
                {kelas}
              </Button>
            ))}
          </div>
        </div>
      )}

      {userRole === "admin" && (
        <>
          {/* New attendance section with tabs and date pagination */}
          <Card>
            <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
              <Typography variant="h6" color="white">
                Absensi Per Kelas
              </Typography>
            </CardHeader>
            <CardBody className="px-0 pt-0 pb-2">
              <div className="px-6">
                <Tabs value={selectedKelas}>
                  <TabsHeader className="overflow-x-auto">
                    {kelasAbsensi.map((kelas) => (
                      <Tab
                        key={kelas.classCode}
                        value={kelas.kelas}
                        onClick={() => {
                          setSelectedKelas(kelas.kelas);
                          setCurrentDateIndex(0);
                        }}
                        className={selectedKelas === kelas.kelas ? "font-bold" : ""}
                      >
                        {kelas.kelas}
                      </Tab>
                    ))}
                  </TabsHeader>
                </Tabs>
              </div>

              {kelasAbsensi.map((kelas) => {
                if (kelas.kelas !== selectedKelas) return null;
                if (!kelas.detailSiswa || !Array.isArray(kelas.detailSiswa)) return null;

                // Get all students in the class
                const allStudents = kelas.detailSiswa.reduce((acc, record) => {
                  if (!record.siswa) return acc;
                  const existingStudent = acc.find(s => s.nis === record.siswa.nis);
                  if (!existingStudent) {
                    acc.push(record.siswa);
                  }
                  return acc;
                }, []);

                if (allStudents.length === 0) return null;

                const groupedByDate = groupAbsensiByDate(kelas.detailSiswa, allStudents);
                const dates = Object.keys(groupedByDate).sort((a, b) =>
                  new Date(b.split(', ')[1]) - new Date(a.split(', ')[1])
                );
                const currentDate = dates[currentDateIndex];
                const currentRecords = groupedByDate[currentDate] || [];

                const todayTotal = currentRecords.length;
                const todayHadir = currentRecords.filter(r => r.status === 'HADIR').length;
                const todaySakit = currentRecords.filter(r => r.status === 'SAKIT').length;
                const todayIzin = currentRecords.filter(r => r.status === 'IZIN').length;
                const todayAlfa = currentRecords.filter(r => r.status === 'ALFA').length;

                return (
                  <div key={kelas.classCode} className="mt-4">
                    <div className="px-6 py-3">
                      <div className="flex justify-between items-center mb-4">
                        <Typography variant="h6" className="text-blue-gray-800">
                          {currentDate}
                        </Typography>
                      </div>

                      <div className="grid grid-cols-5 gap-4">
                        <div className="rounded-lg bg-blue-500 p-4 text-white">
                          <div className="text-sm">Total</div>
                          <div className="text-2xl font-bold">{todayTotal}</div>
                        </div>
                        <div className="rounded-lg bg-green-500 p-4 text-white">
                          <div className="text-sm">Hadir</div>
                          <div className="text-2xl font-bold">{todayHadir}</div>
                        </div>
                        <div className="rounded-lg bg-yellow-500 p-4 text-white">
                          <div className="text-sm">Sakit</div>
                          <div className="text-2xl font-bold">{todaySakit}</div>
                        </div>
                        <div className="rounded-lg bg-orange-500 p-4 text-white">
                          <div className="text-sm">Izin</div>
                          <div className="text-2xl font-bold">{todayIzin}</div>
                        </div>
                        <div className="rounded-lg bg-red-500 p-4 text-white">
                          <div className="text-sm">Alfa</div>
                          <div className="text-2xl font-bold">{todayAlfa}</div>
                        </div>
                      </div>

                      <div className="mt-4 overflow-x-auto">
                        <table className="w-full min-w-[640px] table-auto">
                          <thead>
                            <tr>
                              {["No", "Nama", "NIS", "Status", "Jam Masuk", "Keterangan"].map((el) => (
                                <th key={el} className="border-b border-blue-gray-50 py-3 px-6 text-left">
                                  <Typography
                                    variant="small"
                                    className="text-[11px] font-medium uppercase text-blue-gray-400"
                                  >
                                    {el}
                                  </Typography>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {currentRecords.map((siswa, index) => (
                              <tr key={index}>
                                <td className="py-3 px-6">
                                  <Typography className="text-sm font-medium text-blue-gray-600">
                                    {index + 1}
                                  </Typography>
                                </td>
                                <td className="py-3 px-6">
                                  <div className="flex items-center gap-4">
                                    <Typography
                                      variant="small"
                                      className="text-sm font-medium text-blue-gray-600"
                                    >
                                      {siswa.siswa.nama}
                                    </Typography>
                                  </div>
                                </td>
                                <td className="py-3 px-6">
                                  <Typography className="text-sm font-medium text-blue-gray-600">
                                    {siswa.siswa.nis}
                                  </Typography>
                                </td>
                                <td className="py-3 px-6">
                                  <Chip
                                    variant="gradient"
                                    color={
                                      siswa.status === 'HADIR' ? 'green' :
                                        siswa.status === 'SAKIT' ? 'yellow' :
                                          siswa.status === 'IZIN' ? 'orange' :
                                            'red'
                                    }
                                    value={siswa.status}
                                    className="py-0.5 px-2 text-[11px] font-medium"
                                  />
                                </td>
                                <td className="py-3 px-6">
                                  <Typography className="text-sm font-medium text-blue-gray-600">
                                    {siswa.status === 'ALFA' ? '-' :
                                      siswa.jamMasuk ? new Date(siswa.jamMasuk).toLocaleTimeString('id-ID', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      }) : '-'}
                                  </Typography>
                                </td>
                                <td className="py-3 px-6">
                                  <Typography className="text-sm font-medium text-blue-gray-600">
                                    {siswa.keterangan || '-'}
                                  </Typography>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div className="flex justify-end items-center gap-2 mt-4 px-6">
                          <button
                            onClick={() => setCurrentDateIndex(prev => prev - 1)}
                            className="px-3 py-1 border rounded-md hover:bg-gray-200 disabled:opacity-50"
                            disabled={currentDateIndex === 0}
                          >
                            PREVIOUS
                          </button>
                          <span className="px-3 py-1 border rounded-md bg-gray-100">
                            {currentDateIndex + 1} / {dates.length}
                          </span>
                          <button
                            onClick={() => setCurrentDateIndex(prev => prev + 1)}
                            className="px-3 py-1 border rounded-md hover:bg-gray-200 disabled:opacity-50"
                            disabled={currentDateIndex >= dates.length - 1}
                          >
                            NEXT
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardBody>
          </Card>

          <Card className="h-full w-full">
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

                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Button Download */}
                  <Button
                    variant="outlined"
                    size="sm"
                    color="white"
                    onClick={toggleModal}
                    className="flex items-center gap-2 px-4 transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    <ArrowDownTrayIcon strokeWidth={2} className="h-4 w-4" />
                    Download Rekapan Users
                  </Button>

                  {/* Button Add User */}
                  <Button
                    onClick={handleOpen}
                    className="flex items-center gap-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
                    size="sm"
                  >
                    <UserPlusIcon strokeWidth={2} className="h-4 w-4" />
                    Add User
                  </Button>

                  {/* Modal Pop-up */}
                  {isModalOpen && (
                    <div
                      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                      onClick={toggleModal} // Klik di luar modal untuk close
                    >
                      <div
                        className="bg-white rounded-lg shadow-2xl p-5 w-80 text-center relative transform transition-all duration-300 scale-95 hover:scale-100"
                        onClick={(e) => e.stopPropagation()} // Klik dalam modal tidak close
                      >
                        {/* Close Button */}

                        <IconButton
                          size="sm"
                          variant="text"
                          className="!absolute right-3.5 top-3.5"
                          onClick={toggleModal}
                        >
                        <XMarkIcon className="h-5 w-5 stroke-2" />

                        </IconButton>

                        <h2 className="text-lg font-semibold mb-3 text-gray-900">Pilih Role </h2>

                        <div className="flex flex-col gap-3">
                          {["Siswa", "Guru", "Admin"].map((role) => (
                            <Button
                              key={role}
                              className="w-full bg-gray-800 text-white hover:bg-gray-900 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md"
                              onClick={() => {
                                toggleModal();
                                console.log(`Download Rekapan ${role}`);
                                // Tambahkan logika download sesuai role di sini
                              }}
                            >
                              {role}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

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

                <form onSubmit={handleAddUser}>
                  <DialogBody className="space-y-4 pb-6 max-h-[60vh] overflow-y-auto">
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                        Full Name
                      </Typography>
                      <Input
                        required
                        color="gray"
                        size="lg"
                        name="nama"
                        value={formData.nama}
                        onChange={handleInputChange}
                        placeholder="Enter full name"
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
                        required
                        type="email"
                        color="gray"
                        size="lg"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email"
                        className="placeholder:opacity-100 focus:!border-t-gray-900"
                        containerProps={{ className: "!min-w-full" }}
                        labelProps={{ className: "hidden" }}
                      />
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                        Password
                      </Typography>
                      <Input
                        required
                        type="password"
                        color="gray"
                        size="lg"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter password"
                        className="placeholder:opacity-100 focus:!border-t-gray-900"
                        containerProps={{ className: "!min-w-full" }}
                        labelProps={{ className: "hidden" }}
                      />
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                        Role
                      </Typography>
                      <Select
                        required
                        color="gray"
                        size="lg"
                        name="role"
                        value={formData.role}
                        onChange={(value) => handleInputChange({ target: { name: 'role', value } })}
                        className="placeholder:opacity-100 focus:!border-t-gray-900"
                        containerProps={{ className: "!min-w-full" }}
                        labelProps={{ className: "hidden" }}
                      >
                        <Option value="siswa">Siswa</Option>
                        <Option value="guru">Guru</Option>
                      </Select>
                    </div>

                    {formData.role === 'siswa' ? (
                      <>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                            NIS
                          </Typography>
                          <Input
                            required
                            color="gray"
                            size="lg"
                            name="nis"
                            value={formData.nis}
                            onChange={handleInputChange}
                            placeholder="Enter NIS"
                            className="placeholder:opacity-100 focus:!border-t-gray-900"
                            containerProps={{ className: "!min-w-full" }}
                            labelProps={{ className: "hidden" }}
                          />
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                            NISN
                          </Typography>
                          <Input
                            required
                            color="gray"
                            size="lg"
                            name="nisn"
                            value={formData.nisn}
                            onChange={handleInputChange}
                            placeholder="Enter NISN"
                            className="placeholder:opacity-100 focus:!border-t-gray-900"
                            containerProps={{ className: "!min-w-full" }}
                            labelProps={{ className: "hidden" }}
                          />
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                            Kelas
                          </Typography>
                          <Input
                            required
                            color="gray"
                            size="lg"
                            name="kelas"
                            value={formData.kelas}
                            onChange={handleInputChange}
                            placeholder="Enter Kelas (e.g. XII RPL 2)"
                            className="placeholder:opacity-100 focus:!border-t-gray-900"
                            containerProps={{ className: "!min-w-full" }}
                            labelProps={{ className: "hidden" }}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                            NIP
                          </Typography>
                          <Input
                            required
                            color="gray"
                            size="lg"
                            name="nip"
                            value={formData.nip}
                            onChange={handleInputChange}
                            placeholder="Enter NIP"
                            className="placeholder:opacity-100 focus:!border-t-gray-900"
                            containerProps={{ className: "!min-w-full" }}
                            labelProps={{ className: "hidden" }}
                          />
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                            Mata Pelajaran
                          </Typography>
                          <Input
                            required
                            color="gray"
                            size="lg"
                            name="mataPelajaran"
                            value={formData.mataPelajaran}
                            onChange={handleInputChange}
                            placeholder="Enter Mata Pelajaran"
                            className="placeholder:opacity-100 focus:!border-t-gray-900"
                            containerProps={{ className: "!min-w-full" }}
                            labelProps={{ className: "hidden" }}
                          />
                        </div>
                      </>
                    )}
                  </DialogBody>

                  <DialogFooter>
                    <Button variant="text" onClick={handleOpen} className="mr-2">
                      Cancel
                    </Button>
                    <Button type="submit" className="ml-auto">
                      Add User
                    </Button>
                  </DialogFooter>
                </form>
              </Dialog>
            </CardHeader>

            <div className="flex flex-col items-center justify-between mx-3 gap-4 md:flex-row">
              <Tabs value={selectedFilter} className="w-full md:w-max">
                <TabsHeader>
                  {TABS.map(({ label, value }) => (
                    <Tab
                      key={value}
                      value={value}
                      onClick={() => {
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

            <CardBody className="overflow-x-scroll px-0">
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
                  {paginatedData.map((user, index) => {
                    const isLast = index === paginatedData.length - 1;
                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={user._id || index}>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={getProfilePhotoUrl(user.photo)}
                              alt={user.nama}
                              size="sm"
                              className="object-cover"
                            />
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {user.nama}
                              </Typography>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal opacity-70"
                              >
                                {user.isGuru ? `NIP: ${user.nip}` : `NIS: ${user.nis}`}
                              </Typography>
                              {!user.isGuru && (
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal opacity-70"
                                >
                                  NISN: {user.nisn}
                                </Typography>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {user.email}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {user.kelas}
                          </Typography>
                        </td>
                        {user.isGuru ? <> <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {user.mataPelajaran}
                          </Typography>
                        </td></> : <> <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-center"
                          >
                            -
                          </Typography>
                        </td></>}
                        <td className={classes}>
                          <div className="w-max">
                            <Chip
                              variant="ghost"
                              size="sm"
                              value={user.isGuru ? "Guru" : "Siswa"}
                              color={user.isGuru ? "green" : "blue-gray"}
                            />
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {new Date(user.createdAt).toLocaleDateString()}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Tooltip content="Edit User">
                            <IconButton variant="text" onClick={() => handleOpenEdit(user)}>
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Delete User">
                            <IconButton variant="text" onClick={() => handleDeleteUser(user)}>
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
              <Typography variant="small" color="blue-gray" className="font-normal">
                Page {pageIndex + 1} of {Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
              </Typography>
              <div className="flex gap-2">
                <Button
                  variant="outlined"
                  size="sm"
                  disabled={pageIndex === 0}
                  onClick={() => setPageIndex(pageIndex - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outlined"
                  size="sm"
                  disabled={(pageIndex + 1) * ITEMS_PER_PAGE >= filteredData.length}
                  onClick={() => setPageIndex(pageIndex + 1)}
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
          {/* Edit User Dialog */}
          <Dialog size="sm" open={openEdit} handler={handleCloseEdit} className="p-4">
            <DialogHeader className="relative m-0 block">
              <Typography variant="h4" color="blue-gray">
                Edit User
              </Typography>
              <Typography className="mt-1 font-normal text-gray-600">
                Update user information below.
              </Typography>
              <IconButton
                size="sm"
                variant="text"
                className="!absolute right-3.5 top-3.5"
                onClick={handleCloseEdit}
              >
                <XMarkIcon className="h-4 w-4 stroke-2" />
              </IconButton>
            </DialogHeader>

            <form onSubmit={handleEditUser}>
              <DialogBody className="space-y-4 pb-6 max-h-[60vh] overflow-y-auto">
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                    Full Name
                  </Typography>
                  <Input
                    required
                    color="gray"
                    size="lg"
                    name="nama"
                    value={editFormData.nama}
                    onChange={handleEditInputChange}
                    placeholder="Enter full name"
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
                    required
                    type="email"
                    color="gray"
                    size="lg"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditInputChange}
                    placeholder="Enter email"
                    className="placeholder:opacity-100 focus:!border-t-gray-900"
                    containerProps={{ className: "!min-w-full" }}
                    labelProps={{ className: "hidden" }}
                  />
                </div>

                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                    Role
                  </Typography>
                  <Select
                    required
                    color="gray"
                    size="lg"
                    name="role"
                    value={editFormData.role}
                    onChange={(value) => handleInputChange({ target: { name: 'role', value } })}
                    className="placeholder:opacity-100 focus:!border-t-gray-900"
                    containerProps={{ className: "!min-w-full" }}
                    labelProps={{ className: "hidden" }}
                  >
                    <Option value="siswa">Siswa</Option>
                    <Option value="guru">Guru</Option>
                  </Select>
                </div>

                {editFormData.role === 'siswa' ? (
                  <>
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                        NIS
                      </Typography>
                      <Input
                        required
                        color="gray"
                        size="lg"
                        name="nis"
                        value={editFormData.nis}
                        onChange={handleEditInputChange}
                        placeholder="Enter NIS"
                        className="placeholder:opacity-100 focus:!border-t-gray-900"
                        containerProps={{ className: "!min-w-full" }}
                        labelProps={{ className: "hidden" }}
                      />
                    </div>
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                        NISN
                      </Typography>
                      <Input
                        required
                        color="gray"
                        size="lg"
                        name="nisn"
                        value={editFormData.nisn}
                        onChange={handleEditInputChange}
                        placeholder="Enter NISN"
                        className="placeholder:opacity-100 focus:!border-t-gray-900"
                        containerProps={{ className: "!min-w-full" }}
                        labelProps={{ className: "hidden" }}
                      />
                    </div>
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                        Kelas
                      </Typography>
                      <Input
                        required
                        color="gray"
                        size="lg"
                        name="kelas"
                        value={editFormData.kelas}
                        onChange={handleEditInputChange}
                        placeholder="Enter Kelas (e.g. XII RPL 2)"
                        className="placeholder:opacity-100 focus:!border-t-gray-900"
                        containerProps={{ className: "!min-w-full" }}
                        labelProps={{ className: "hidden" }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                        NIP
                      </Typography>
                      <Input
                        required
                        color="gray"
                        size="lg"
                        name="nip"
                        value={editFormData.nip}
                        onChange={handleEditInputChange}
                        placeholder="Enter NIP"
                        className="placeholder:opacity-100 focus:!border-t-gray-900"
                        containerProps={{ className: "!min-w-full" }}
                        labelProps={{ className: "hidden" }}
                      />
                    </div>
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                        Kelas
                      </Typography>
                      <Input
                        required
                        color="gray"
                        size="lg"
                        name="kelas"
                        value={editFormData.kelas}
                        onChange={handleEditInputChange}
                        placeholder="Enter Kelas (e.g. XII RPL 2)"
                        className="placeholder:opacity-100 focus:!border-t-gray-900"
                        containerProps={{ className: "!min-w-full" }}
                        labelProps={{ className: "hidden" }}
                      />
                    </div>
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                        Mata Pelajaran
                      </Typography>
                      <Input
                        required
                        color="gray"
                        size="lg"
                        name="mataPelajaran"
                        value={editFormData.mataPelajaran}
                        onChange={handleEditInputChange}
                        placeholder="Enter Mata Pelajaran"
                        className="placeholder:opacity-100 focus:!border-t-gray-900"
                        containerProps={{ className: "!min-w-full" }}
                        labelProps={{ className: "hidden" }}
                      />
                    </div>
                  </>
                )}

                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
                    Password
                  </Typography>
                  <Input
                    type="password"
                    color="gray"
                    size="lg"
                    name="password"
                    value={editFormData.password}
                    onChange={handleEditInputChange}
                    placeholder="Enter new password (leave empty to keep current)"
                    className="placeholder:opacity-100 focus:!border-t-gray-900"
                    containerProps={{ className: "!min-w-full" }}
                    labelProps={{ className: "hidden" }}
                  />
                </div>
              </DialogBody>

              <DialogFooter>
                <Button variant="text" onClick={handleCloseEdit} className="mr-2">
                  Cancel
                </Button>
                <Button type="submit" className="ml-auto">
                  Update User
                </Button>
              </DialogFooter>
            </form>
          </Dialog>
        </>

      )}

    </div>
  );
}

export default History;
