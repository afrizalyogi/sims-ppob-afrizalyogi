import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  getProfile,
  updateProfileData,
  updateProfilePicture,
  selectUserProfile,
  selectUpdateStatus,
  selectProfileStatus,
  clearUpdateStatus,
} from "../../features/profileSlice";
import { logout } from "../../features/authSlice";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const UpdateProfileSchema = Yup.object().shape({
  first_name: Yup.string().required("Nama depan wajib diisi."),
  last_name: Yup.string().required("Nama belakang wajib diisi."),
});

export default function Profile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(selectUserProfile);
  const profileStatus = useAppSelector(selectProfileStatus);
  const updateStatus = useAppSelector(selectUpdateStatus);
  const [isEditing, setIsEditing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isUpdating = updateStatus === "loading";

  const formik = useFormik({
    initialValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
    },
    validationSchema: UpdateProfileSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(updateProfileData(values));
    },
  });

  useEffect(() => {
    if (!user && profileStatus === "idle") {
      dispatch(getProfile());
    }
  }, [dispatch, user, profileStatus]);

  useEffect(() => {
    if (updateStatus === "succeeded") {
      alert("Perubahan berhasil disimpan!");
      setIsEditing(false);
      dispatch(clearUpdateStatus());
    } else if (updateStatus === "failed") {
      alert("Gagal menyimpan perubahan. Coba lagi.");
      dispatch(clearUpdateStatus());
    }
  }, [updateStatus, dispatch]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 100 * 1024;
    if (file.size > MAX_SIZE) {
      alert("Ukuran gambar maksimal 100 KB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    dispatch(updateProfilePicture(formData));
  };

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      dispatch(logout());
      navigate("/login");
    }
  };

  if (profileStatus === "loading" && !user) {
    return <div className="mx-auto p-8 text-center">Memuat Profile...</div>;
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-red-600">
        Gagal memuat data profile.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-8">
      <div className="mx-auto mb-6 flex flex-col items-center">
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <div
          className="relative h-32 w-32 cursor-pointer overflow-hidden rounded-full border-2 border-gray-200 shadow-md"
          onClick={() => fileInputRef.current?.click()}
          title="Klik untuk mengubah foto"
        >
          <img
            src={
              user?.profile_image ===
              "https://minio.nutech-integrasi.com/take-home-test/null"
                ? "/Profile Photo.png"
                : user?.profile_image || "/Profile Photo.png"
            }
            alt="Profile"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black text-xl text-white opacity-0 transition duration-300 hover:opacity-20">
            {isUpdating ? "..." : "Ganti"}
          </div>
        </div>

        <h2 className="mt-4 text-xl font-semibold">{`${user.first_name} ${user.last_name}`}</h2>
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="mx-auto max-w-4xl space-y-4"
      >
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          icon="📧"
          value={user.email}
          disabled={true}
        />

        <label htmlFor="first_name">Nama Depan</label>
        <Input
          id="first_name"
          type="text"
          placeholder="Nama Depan"
          icon="👤"
          disabled={!isEditing || isUpdating}
          {...formik.getFieldProps("first_name")}
          error={
            formik.touched.first_name ? formik.errors.first_name : undefined
          }
        />

        <label htmlFor="last_name">Nama Belakang</label>
        <Input
          id="last_name"
          type="text"
          placeholder="Nama Belakang"
          icon="👤"
          disabled={!isEditing || isUpdating}
          {...formik.getFieldProps("last_name")}
          error={formik.touched.last_name ? formik.errors.last_name : undefined}
        />

        <div className="space-y-3 pt-4">
          {isEditing ? (
            <>
              <Button
                type="submit"
                isLoading={isUpdating}
                disabled={!formik.isValid || isUpdating}
              >
                Simpan
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  formik.resetForm();
                }}
                disabled={isUpdating}
                variant="outline"
              >
                Batalkan
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
                }}
                variant="outline"
              >
                Edit Profile
              </Button>
              <Button
                type="button"
                onClick={handleLogout}
                disabled={isUpdating}
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
