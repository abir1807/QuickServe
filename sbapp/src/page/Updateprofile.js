import React, { useState, useEffect } from "react";
import axios from "axios";

function UpdateProfile() {

  const [provider, setProvider] = useState({
    email: "",
    providerName: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // verification state
  const [isVerified, setIsVerified] = useState(false);

  const [verifyMessage, setVerifyMessage] = useState("");

  const [isChecking, setIsChecking] = useState(false);



  // Load provider from localStorage
  useEffect(() => {

    const storedProvider =
      JSON.parse(localStorage.getItem("provider"));

    if (storedProvider) {
      setProvider(storedProvider);
    }

  }, []);




  // Handle profile change
  const handleChange = (e) => {

    setProvider({
      ...provider,
      [e.target.name]: e.target.value
    });

  };



  // Handle password field change
  const handlePasswordChange = (e) => {

    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });

  };



  // Verify old password with backend
  const verifyOldPassword = async () => {

    if (!passwordData.oldPassword) {

      setVerifyMessage("Enter old password");
      setIsVerified(false);
      return;

    }

    setIsChecking(true);

    try {

      await axios.post(
        "http://localhost:8086/provider/login",
        {
          email: provider.email,
          password: passwordData.oldPassword
        }
      );

      setIsVerified(true);
      setVerifyMessage("Password verified ✅");

    }
    catch {

      setIsVerified(false);
      setVerifyMessage("Wrong password ❌");

    }

    setIsChecking(false);

  };



  // Update profile
  const handleUpdate = async (e) => {

    e.preventDefault();

    if (!isVerified) {

      alert("Please verify old password first");
      return;

    }

    if (
      passwordData.newPassword &&
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {

      alert("New password and confirm password do not match");
      return;

    }

    try {

      const response = await axios.put(
        "http://localhost:8086/updater",
        {
          ...provider,
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        }
      );

      localStorage.setItem(
        "provider",
        JSON.stringify(response.data)
      );

      alert("Profile updated successfully");

      // Reset password fields
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      setIsVerified(false);
      setVerifyMessage("");

    }
    catch (error) {

      alert("Update failed");

    }

  };



  return (

    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-body">

          <h3 className="mb-3">Update Profile</h3>

          <form onSubmit={handleUpdate}>


            {/* Email */}
            <div className="mb-3">

              <label>Email</label>

              <input
                type="email"
                value={provider.email}
                className="form-control"
                readOnly
              />

            </div>



            {/* Old Password Verify */}
            <div className="mb-3">

              <label>Enter Old Password to Unlock</label>

              <div className="d-flex gap-2">

                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className="form-control"
                />

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={verifyOldPassword}
                >
                  Verify
                </button>

              </div>

              {isChecking && (
                <small>Checking password...</small>
              )}

              <small className="ms-1">
                {verifyMessage}
              </small>

            </div>



            {/* Name */}
            <div className="mb-2">

              <label>Name</label>

              <input
                type="text"
                name="providerName"
                value={provider.providerName || ""}
                onChange={handleChange}
                className="form-control"
                disabled={!isVerified}
              />

            </div>



            {/* Mobile */}
            <div className="mb-2">

              <label>Mobile</label>

              <input
                type="text"
                name="mobile"
                value={provider.mobile || ""}
                onChange={handleChange}
                className="form-control"
                disabled={!isVerified}
              />

            </div>



            {/* Address */}
            <div className="mb-3">

              <label>Address</label>

              <input
                type="text"
                name="address"
                value={provider.address || ""}
                onChange={handleChange}
                className="form-control"
                disabled={!isVerified}
              />

            </div>



            <hr />



            <h5>Change Password</h5>



            {/* New Password */}
            <div className="mb-2">

              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                placeholder="New Password"
                onChange={handlePasswordChange}
                className="form-control"
                disabled={!isVerified}
              />

            </div>



            {/* Confirm Password */}
            <div className="mb-3">

              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                placeholder="Confirm Password"
                onChange={handlePasswordChange}
                className="form-control"
                disabled={!isVerified}
              />

            </div>



            {/* Update Button */}
            <button
              className="btn btn-success w-100"
              disabled={!isVerified}
            >
              Update Profile
            </button>



          </form>

        </div>

      </div>

    </div>

  );

}

export default UpdateProfile;