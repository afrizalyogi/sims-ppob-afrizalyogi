import React, { useState, useEffect, useRef } from "react";
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

import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";

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
    return <div className="p-8 text-center">Memuat Profile...</div>;
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-red-600">
        Gagal memuat data profile.
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex flex-col items-center mb-6">
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <div
          className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer shadow-md border-2 border-gray-200"
          onClick={() => fileInputRef.current?.click()}
          title="Klik untuk mengubah foto"
        >
          <img
            src={user.profile_image || "/src/assets/default-profile.png"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition duration-300 flex items-center justify-center text-white text-xl">
            {isUpdating ? "..." : "Ganti"}
          </div>
        </div>

        <h2 className="mt-4 text-xl font-semibold">{`${user.first_name} ${user.last_name}`}</h2>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          icon="📧"
          value={user.email}
          disabled={true}
        />

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

        <Input
          id="last_name"
          type="text"
          placeholder="Nama Belakang"
          icon="👤"
          disabled={!isEditing || isUpdating}
          {...formik.getFieldProps("last_name")}
          error={formik.touched.last_name ? formik.errors.last_name : undefined}
        />

        <div className="pt-4 space-y-3">
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
              >
                Edit Profile
              </Button>
              <Button
                type="button"
                onClick={handleLogout}
                disabled={isUpdating}
                variant="outline"
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
