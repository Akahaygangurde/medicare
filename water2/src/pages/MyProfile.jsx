// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import sha256 from "sha256";
// import Sidebar from "../components/Sidebar";
// import { Eye, EyeOff } from "lucide-react";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { ethers } from "ethers";
// import { contractABI } from "./constants";
// import Modal from "react-modal";

// Modal.setAppElement("#root");

// // Hardcoded values for local Hardhat (DO NOT use in production)
// const PRIVATE_KEY = "0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61";
// const PROVIDER_URL = "http://127.0.0.1:8545";
// const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// // Validation functions
// const validateEmail = (email) => {
//   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return re.test(email);
// };

// const validatePassword = (password) => {
//   return password.length >= 8;
// };

// const validatePhone = (phone) => {
//   const re = /^[0-9]{10,15}$/;
//   return re.test(phone);
// };

// const validateAge = (age) => {
//   return age >= 0 && age <= 120;
// };

// const validateBloodGroup = (bloodGroup) => {
//   const validGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
//   return validGroups.includes(bloodGroup.toUpperCase());
// };

// const validateEmergencyContact = (contact) => {
//   return contact.length >= 10 && /^[0-9]+$/.test(contact);
// };

// const MyProfile = () => {
//   const [user, setUser] = useState(null);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     gender: "",
//     dob: "",
//     phone: "",
//     bloodGroup: "",
//     age: "",
//     emergencyContact: "",
//     allergies: "",
//     vaccinationHistory: "",
//     healthInsurancePolicy: "",
//     doctorAssigned: "",
//     documents: ""
//   });
//   const [formErrors, setFormErrors] = useState({
//     email: "",
//     password: "",
//     gender: "",
//     phone: "",
//     bloodGroup: "",
//     age: "",
//     emergencyContact: "",
//     dob: ""
//   });
//   const [isPdfOpen, setIsPdfOpen] = useState(false);
//   const [prescriptionImage, setPrescriptionImage] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState(null);
//   const [pdfRecord, setPdfRecord] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [contract, setContract] = useState(null);
//   const [account, setAccount] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem("jwtToken");
//         if (!token) {
//           setError("User token not found");
//           setLoading(false);
//           return;
//         }
//         const response = await axios.get("http://localhost:4000/api/user/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (response.data.success) {
//           setUser(response.data.user);
//           setFormData({
//             email: response.data.user.email || "",
//             password: response.data.user.password || "",
//             gender: response.data.user.gender || "",
//             dob: response.data.user.dob || "",
//             phone: response.data.user.phone || "",
//             bloodGroup: response.data.user.bloodGroup || "",
//             age: response.data.user.age || "",
//             emergencyContact: response.data.user.emergencyContact || "",
//             allergies: response.data.user.allergies || "",
//             vaccinationHistory: response.data.user.vaccinationHistory || "",
//             healthInsurancePolicy: response.data.user.healthInsurancePolicy || "",
//             doctorAssigned: response.data.user.doctorAssigned || "",
//             documents: response.data.user.documents?.pdf || ""
//           });
//           if (response.data.user.documents && response.data.user.documents.pdf) {
//             const base64Data = response.data.user.documents.pdf;
//             const byteCharacters = atob(base64Data);
//             const byteNumbers = new Array(byteCharacters.length);
//             for (let i = 0; i < byteCharacters.length; i++) {
//               byteNumbers[i] = byteCharacters.charCodeAt(i);
//             }
//             const byteArray = new Uint8Array(byteNumbers);
//             const blob = new Blob([byteArray], { type: "application/pdf" });
//             const pdfBlobUrl = URL.createObjectURL(blob);
//             setPdfUrl(pdfBlobUrl);
//           }
//         } else {
//           setError("Failed to load user data.");
//         }
//       } catch (err) {
//         console.error("Error fetching user data:", err);
//         setError("Error fetching user data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserData();
//   }, []);

//   const validateForm = () => {
//     const errors = {};
//     let isValid = true;

//     if (!formData.email) {
//       errors.email = "Email is required";
//       isValid = false;
//     } else if (!validateEmail(formData.email)) {
//       errors.email = "Please enter a valid email address";
//       isValid = false;
//     }

//     if (!formData.password) {
//       errors.password = "Password is required";
//       isValid = false;
//     } else if (!validatePassword(formData.password)) {
//       errors.password = "Password must be at least 8 characters long";
//       isValid = false;
//     }

//     if (!formData.gender) {
//       errors.gender = "Gender is required";
//       isValid = false;
//     }

//     if (!formData.phone) {
//       errors.phone = "Phone number is required";
//       isValid = false;
//     } else if (!validatePhone(formData.phone)) {
//       errors.phone = "Please enter a valid phone number (10-15 digits)";
//       isValid = false;
//     }

//     if (!formData.bloodGroup) {
//       errors.bloodGroup = "Blood group is required";
//       isValid = false;
//     } else if (!validateBloodGroup(formData.bloodGroup)) {
//       errors.bloodGroup = "Please enter a valid blood group (e.g., A+, B-, etc.)";
//       isValid = false;
//     }

//     if (!formData.age) {
//       errors.age = "Age is required";
//       isValid = false;
//     } else if (!validateAge(formData.age)) {
//       errors.age = "Please enter a valid age (0-120)";
//       isValid = false;
//     }

//     if (!formData.emergencyContact) {
//       errors.emergencyContact = "Emergency contact is required";
//       isValid = false;
//     } else if (!validateEmergencyContact(formData.emergencyContact)) {
//       errors.emergencyContact = "Please enter a valid emergency contact number (at least 10 digits)";
//       isValid = false;
//     }

//     if (!formData.dob) {
//       errors.dob = "Date of birth is required";
//       isValid = false;
//     }

//     setFormErrors(errors);
//     return isValid;
//   };

//   const handleFieldChange = (field, value) => {
//     setFormData({ ...formData, [field]: value });
    
//     // Clear error when user starts typing
//     if (formErrors[field]) {
//       setFormErrors({ ...formErrors, [field]: "" });
//     }
//   };

//   const generatePDF = (data) => {
//     const doc = new jsPDF();
//     doc.text("User Profile", 14, 15);

//     const tableColumn = ["Field", "Value"];
//     const tableRows = [];

//     Object.entries(data).forEach(([key, value]) => {
//       tableRows.push([key, value]);
//     });

//     doc.autoTable({
//       head: [tableColumn],
//       body: tableRows,
//       startY: 20,
//     });

//     const pdfBlob = doc.output("blob");
//     const blobUrl = URL.createObjectURL(pdfBlob);
//     const pdfArrayBuffer = doc.output("arraybuffer");

//     return { blobUrl, pdfArrayBuffer };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setPdfUrl(null);
//     setPdfRecord(null);

//     const submitData = new FormData();
//     Object.keys(formData).forEach((key) => {
//       submitData.append(key, formData[key]);
//     });
//     if (prescriptionImage) {
//       submitData.append("prescriptionImage", prescriptionImage);
//     }

//     try {
//       const response = await axios.put(
//         "http://localhost:4000/api/user/update",
//         submitData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       if (response.data.success) {
//         setUser(response.data.user);
//         alert("Profile updated successfully");
//         const { blobUrl, pdfArrayBuffer } = generatePDF(response.data.user);
//         setPdfUrl(blobUrl);
//         await handleStorePdf(pdfArrayBuffer);
//         setIsEditing(false);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStorePdf = async (pdfArrayBuffer) => {
//     try {
//       console.log("handleStorePdf: Started processing PDF");
//       const pdfHash = sha256(pdfArrayBuffer);
//       console.log("handleStorePdf: Computed PDF hash:", pdfHash);
//       const pdfBlob = new Blob([pdfArrayBuffer], { type: "application/pdf" });
//       const pdfFile = new File([pdfBlob], "profile.pdf", { type: "application/pdf" });
//       console.log("handleStorePdf: Created PDF file:", pdfFile);
//       const pdfFormData = new FormData();
//       pdfFormData.append("pdf", pdfFile);
//       console.log("handleStorePdf: FormData prepared. Keys:", [...pdfFormData.keys()]);
//       const uploadUrl = "http://localhost:4000/api/user/upload-pdf";
//       console.log("handleStorePdf: Sending PUT request to:", uploadUrl);
//       const response = await axios.put(uploadUrl, pdfFormData);
//       console.log("handleStorePdf: Received response:", response);
//       console.log("handleStorePdf: PDF stored in MongoDB successfully!");
//     } catch (err) {
//       console.error("handleStorePdf: Error storing PDF in MongoDB:", err);
//       if (err.response) {
//         console.error("handleStorePdf: Error response data:", err.response.data);
//         console.error("handleStorePdf: Error response status:", err.response.status);
//       }
//     }
//   };

//   const handleEditClick = () => {
//     setIsEditing(true);
//   };

//   const handleCancelEdit = () => {
//     setFormData({
//       email: user?.email || "",
//       password: user?.password || "",
//       gender: user?.gender || "",
//       dob: user?.dob || "",
//       phone: user?.phone || "",
//       bloodGroup: user?.bloodGroup || "",
//       age: user?.age || "",
//       emergencyContact: user?.emergencyContact || "",
//       allergies: user?.allergies || "",
//       vaccinationHistory: user?.vaccinationHistory || "",
//       healthInsurancePolicy: user?.healthInsurancePolicy || "",
//       doctorAssigned: user?.doctorAssigned || "",
//       documents: user?.documents || ""
//     });
//     setPrescriptionImage(null);
//     setIsEditing(false);
//     setFormErrors({
//       email: "",
//       password: "",
//       gender: "",
//       phone: "",
//       bloodGroup: "",
//       age: "",
//       emergencyContact: "",
//       dob: ""
//     });
//   };

//   const renderDisplayView = () => (
//     <div className="space-y-4">
//       <p>
//         <span className="font-medium">Email:</span> {user?.email}
//       </p>
//       <p>
//         <span className="font-medium">Password:</span> ********
//       </p>
//       <p>
//         <span className="font-medium">Gender:</span> {user?.gender}
//       </p>
//       <p>
//         <span className="font-medium">DOB:</span> {user?.dob}
//       </p>
//       <p>
//         <span className="font-medium">Phone:</span> {user?.phone}
//       </p>
//       <p>
//         <span className="font-medium">Blood Group:</span> {user?.bloodGroup}
//       </p>
//       <p>
//         <span className="font-medium">Age:</span> {user?.age}
//       </p>
//       <p>
//         <span className="font-medium">Emergency Contact:</span> {user?.emergencyContact}
//       </p>
//       <p>
//         <span className="font-medium">Allergies:</span> {user?.allergies}
//       </p>
//       <p>
//         <span className="font-medium">Vaccination History:</span> {user?.vaccinationHistory}
//       </p>
//       {pdfUrl && (
//         <button
//           onClick={() => setIsPdfOpen(true)}
//           className="mt-4 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Preview PDF
//         </button>
//       )}
//       <button
//         onClick={handleEditClick}
//         className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//       >
//         Edit Profile
//       </button>
//     </div>
//   );

//   const renderEditView = () => (
//     <form onSubmit={handleSubmit}>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Email */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Email
//           </label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={(e) => handleFieldChange("email", e.target.value)}
//             className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50 ${
//               formErrors.email ? "border-red-500" : ""
//             }`}
//             autoComplete="email"
//             required
//           />
//           {formErrors.email && (
//             <p className="text-red-500 text-xs italic">{formErrors.email}</p>
//           )}
//         </div>
//         {/* Password */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Password
//           </label>
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={formData.password}
//               onChange={(e) => handleFieldChange("password", e.target.value)}
//               className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50 ${
//                 formErrors.password ? "border-red-500" : ""
//               }`}
//               placeholder="Enter your password"
//               autoComplete="current-password"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute inset-y-0 right-0 pr-3 flex items-center"
//             >
//               {showPassword ? (
//                 <EyeOff className="h-5 w-5 text-gray-500" />
//               ) : (
//                 <Eye className="h-5 w-5 text-gray-500" />
//               )}
//             </button>
//           </div>
//           {formErrors.password && (
//             <p className="text-red-500 text-xs italic">{formErrors.password}</p>
//           )}
//         </div>
//         {/* Gender */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Gender
//           </label>
//           <select
//             name="gender"
//             value={formData.gender}
//             onChange={(e) => handleFieldChange("gender", e.target.value)}
//             className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50 ${
//               formErrors.gender ? "border-red-500" : ""
//             }`}
//             required
//           >
//             <option value="" disabled>
//               Select your gender
//             </option>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//             <option value="Others">Others</option>
//           </select>
//           {formErrors.gender && (
//             <p className="text-red-500 text-xs italic">{formErrors.gender}</p>
//           )}
//         </div>
//         {/* DOB */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Date of Birth
//           </label>
//           <input
//             type="date"
//             name="dob"
//             value={formData.dob}
//             onChange={(e) => handleFieldChange("dob", e.target.value)}
//             className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50 ${
//               formErrors.dob ? "border-red-500" : ""
//             }`}
//             required
//           />
//           {formErrors.dob && (
//             <p className="text-red-500 text-xs italic">{formErrors.dob}</p>
//           )}
//         </div>
//         {/* Phone */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Phone Number
//           </label>
//           <input
//             type="tel"
//             name="phone"
//             value={formData.phone}
//             onChange={(e) => handleFieldChange("phone", e.target.value)}
//             className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50 ${
//               formErrors.phone ? "border-red-500" : ""
//             }`}
//             placeholder="Enter your phone number"
//             autoComplete="tel"
//             required
//           />
//           {formErrors.phone && (
//             <p className="text-red-500 text-xs italic">{formErrors.phone}</p>
//           )}
//         </div>
//         {/* Blood Group */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Blood Group
//           </label>
//           <select
//             name="bloodGroup"
//             value={formData.bloodGroup}
//             onChange={(e) => handleFieldChange("bloodGroup", e.target.value)}
//             className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50 ${
//               formErrors.bloodGroup ? "border-red-500" : ""
//             }`}
//             required
//           >
//             <option value="" disabled>Select blood group</option>
//             <option value="A+">A+</option>
//             <option value="A-">A-</option>
//             <option value="B+">B+</option>
//             <option value="B-">B-</option>
//             <option value="AB+">AB+</option>
//             <option value="AB-">AB-</option>
//             <option value="O+">O+</option>
//             <option value="O-">O-</option>
//           </select>
//           {formErrors.bloodGroup && (
//             <p className="text-red-500 text-xs italic">{formErrors.bloodGroup}</p>
//           )}
//         </div>
//         {/* Age */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Age
//           </label>
//           <input
//             type="number"
//             name="age"
//             value={formData.age}
//             onChange={(e) => handleFieldChange("age", e.target.value)}
//             className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50 ${
//               formErrors.age ? "border-red-500" : ""
//             }`}
//             placeholder="Enter your age"
//             min="0"
//             max="120"
//             required
//           />
//           {formErrors.age && (
//             <p className="text-red-500 text-xs italic">{formErrors.age}</p>
//           )}
//         </div>
//         {/* Emergency Contact */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             Emergency Contact
//           </label>
//           <input
//             type="tel"
//             name="emergencyContact"
//             value={formData.emergencyContact}
//             onChange={(e) => handleFieldChange("emergencyContact", e.target.value)}
//             className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50 ${
//               formErrors.emergencyContact ? "border-red-500" : ""
//             }`}
//             placeholder="Enter emergency contact number"
//             required
//           />
//           {formErrors.emergencyContact && (
//             <p className="text-red-500 text-xs italic">{formErrors.emergencyContact}</p>
//           )}
//         </div>
//         {/* Additional Fields */}
//         {Object.keys(formData)
//           .filter((field) =>
//             !["email", "password", "gender", "phone", "bloodGroup", "age", "doctorAssigned", "dob", "emergencyContact"].includes(field)
//           )
//           .map((field) => (
//             <div key={field} className="mb-4">
//               <label className="block text-gray-700 text-sm font-bold mb-2 capitalize">
//                 {field.replace(/([A-Z])/g, " $1")}
//               </label>
//               <input
//                 type="text"
//                 name={field}
//                 value={formData[field]}
//                 onChange={(e) => handleFieldChange(field, e.target.value)}
//                 className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50"
//                 autoComplete="off"
//               />
//             </div>
//           ))}
//       </div>
//       {/* Prescription Image Upload */}
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">
//           Prescription Image
//         </label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setPrescriptionImage(e.target.files[0])}
//           className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50"
//         />
//       </div>
//       {/* Save and Cancel Buttons */}
//       <div className="flex gap-4">
//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none ${
//             loading ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//         >
//           {loading ? "Updating..." : "Save"}
//         </button>
//         <button
//           type="button"
//           onClick={handleCancelEdit}
//           className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Loading profile...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-red-600">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex bg-white">
//       <Sidebar />
//       <div className="flex-1 p-8">
//         <div className="bg-white p-8 rounded-lg shadow-md">
//           <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
//             My Profile
//           </h2>
//           {error && (
//             <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
//               {error}
//             </div>
//           )}
//           {isEditing ? renderEditView() : renderDisplayView()}
//           {pdfUrl && (
//             <div className="mt-4 text-center space-y-4">
//               <a
//                 href={pdfUrl}
//                 download="profile.pdf"
//                 className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//               >
//                 Download PDF
//               </a>
//             </div>
//           )}
//         </div>
//       </div>
//       <Modal
//         isOpen={isPdfOpen}
//         onRequestClose={() => setIsPdfOpen(false)}
//         style={{
//           content: { width: "80%", height: "80%", margin: "auto", overflow: "hidden" },
//         }}
//       >
//         <div className="flex justify-end">
//           <button onClick={() => setIsPdfOpen(false)} className="text-red-500 font-bold">
//             Close
//           </button>
//         </div>
//         {pdfUrl ? (
//           <iframe
//             src={pdfUrl}
//             title="PDF Preview"
//             width="100%"
//             height="100%"
//             style={{ border: "none" }}
//           />
//         ) : (
//           <p>No PDF available</p>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default MyProfile;



import { useState, useEffect } from "react";
import axios from "axios";
import sha256 from "sha256";
import Sidebar from "../components/Sidebar";
import { Eye, EyeOff } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ethers } from "ethers";
import { contractABI } from "./constants";
import Modal from "react-modal";

Modal.setAppElement("#root");

// Hardcoded values for local Hardhat (DO NOT use in production)
const PRIVATE_KEY = "0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61";
const PROVIDER_URL = "http://127.0.0.1:8545";
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Validation functions
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const validatePhone = (phone) => {
  return /^[0-9]{10,15}$/.test(phone);
};

const validateAge = (age) => {
  return age >= 0 && age <= 120;
};

const validateBloodGroup = (bloodGroup) => {
  const validGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  return validGroups.includes(bloodGroup.toUpperCase());
};

const validateEmergencyContact = (contact) => {
  // Strict validation - exactly 10 digits and nothing else
  return /^[0-9]{10}$/.test(contact);
};
const validateAllergies = (allergies) => {
  if (!allergies) return true; // Optional field
  return allergies.length <= 500; // Limit to 500 characters
};

const validateVaccinationHistory = (history) => {
  if (!history) return true; // Optional field
  return history.length <= 1000; // Limit to 1000 characters
};

const validateHealthInsurancePolicy = (policy) => {
  if (!policy) return true; // Optional field
  return /^[A-Za-z0-9\- ]+$/.test(policy); // Only alphanumeric, spaces and hyphens
};

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    gender: "",
    dob: "",
    phone: "",
    bloodGroup: "",
    age: "",
    emergencyContact: "",
    allergies: "",
    vaccinationHistory: "",
    healthInsurancePolicy: "",
    doctorAssigned: "",
    documents: ""
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    gender: "",
    phone: "",
    bloodGroup: "",
    age: "",
    emergencyContact: "",
    dob: "",
    allergies: "",
    vaccinationHistory: "",
    healthInsurancePolicy: ""
  });
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [prescriptionImage, setPrescriptionImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfRecord, setPdfRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          setError("User token not found");
          setLoading(false);
          return;
        }
        const response = await axios.get("http://localhost:4000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setUser(response.data.user);
          setFormData({
            email: response.data.user.email || "",
            password: response.data.user.password || "",
            gender: response.data.user.gender || "",
            dob: response.data.user.dob || "",
            phone: response.data.user.phone || "",
            bloodGroup: response.data.user.bloodGroup || "",
            age: response.data.user.age || "",
            emergencyContact: response.data.user.emergencyContact || "",
            allergies: response.data.user.allergies || "",
            vaccinationHistory: response.data.user.vaccinationHistory || "",
            healthInsurancePolicy: response.data.user.healthInsurancePolicy || "",
            doctorAssigned: response.data.user.doctorAssigned || "",
            documents: response.data.user.documents?.pdf || ""
          });
          if (response.data.user.documents && response.data.user.documents.pdf) {
            const base64Data = response.data.user.documents.pdf;
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "application/pdf" });
            const pdfBlobUrl = URL.createObjectURL(blob);
            setPdfUrl(pdfBlobUrl);
          }
        } else {
          setError("Failed to load user data.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Basic info validation
    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (!validatePassword(formData.password)) {
      errors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    if (!formData.gender) {
      errors.gender = "Gender is required";
      isValid = false;
    }

    if (!formData.phone) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      errors.phone = "Please enter a valid phone number (10-15 digits)";
      isValid = false;
    }

    if (!formData.bloodGroup) {
      errors.bloodGroup = "Blood group is required";
      isValid = false;
    } else if (!validateBloodGroup(formData.bloodGroup)) {
      errors.bloodGroup = "Please enter a valid blood group (e.g., A+, B-, etc.)";
      isValid = false;
    }

    if (!formData.age) {
      errors.age = "Age is required";
      isValid = false;
    } else if (!validateAge(formData.age)) {
      errors.age = "Please enter a valid age (0-120)";
      isValid = false;
    }

    if (!formData.emergencyContact) {
      errors.emergencyContact = "Emergency contact is required";
      isValid = false;
    } else if (!validateEmergencyContact(formData.emergencyContact)) {
      errors.emergencyContact = "Please enter a valid emergency contact number (at least 10 digits)";
      isValid = false;
    }

    if (!formData.dob) {
      errors.dob = "Date of birth is required";
      isValid = false;
    }

    // Medical info validation
    if (!validateAllergies(formData.allergies)) {
      errors.allergies = "Allergies description too long (max 500 characters)";
      isValid = false;
    }

    if (!validateVaccinationHistory(formData.vaccinationHistory)) {
      errors.vaccinationHistory = "Vaccination history too long (max 1000 characters)";
      isValid = false;
    }

    if (!validateHealthInsurancePolicy(formData.healthInsurancePolicy)) {
      errors.healthInsurancePolicy = "Only alphanumeric characters, spaces and hyphens are allowed";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: "" });
    }
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();
    doc.text("User Profile", 14, 15);

    const tableColumn = ["Field", "Value"];
    const tableRows = [];

    Object.entries(data).forEach(([key, value]) => {
      tableRows.push([key, value]);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    const pdfBlob = doc.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);
    const pdfArrayBuffer = doc.output("arraybuffer");

    return { blobUrl, pdfArrayBuffer };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setPdfUrl(null);
    setPdfRecord(null);

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
    });
    if (prescriptionImage) {
      submitData.append("prescriptionImage", prescriptionImage);
    }

    try {
      const response = await axios.put(
        "http://localhost:4000/api/user/update",
        submitData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data.success) {
        setUser(response.data.user);
        alert("Profile updated successfully");
        const { blobUrl, pdfArrayBuffer } = generatePDF(response.data.user);
        setPdfUrl(blobUrl);
        await handleStorePdf(pdfArrayBuffer);
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleStorePdf = async (pdfArrayBuffer) => {
    try {
      console.log("handleStorePdf: Started processing PDF");
      const pdfHash = sha256(pdfArrayBuffer);
      console.log("handleStorePdf: Computed PDF hash:", pdfHash);
      const pdfBlob = new Blob([pdfArrayBuffer], { type: "application/pdf" });
      const pdfFile = new File([pdfBlob], "profile.pdf", { type: "application/pdf" });
      console.log("handleStorePdf: Created PDF file:", pdfFile);
      const pdfFormData = new FormData();
      pdfFormData.append("pdf", pdfFile);
      console.log("handleStorePdf: FormData prepared. Keys:", [...pdfFormData.keys()]);
      const uploadUrl = "http://localhost:4000/api/user/upload-pdf";
      console.log("handleStorePdf: Sending PUT request to:", uploadUrl);
      const response = await axios.put(uploadUrl, pdfFormData);
      console.log("handleStorePdf: Received response:", response);
      console.log("handleStorePdf: PDF stored in MongoDB successfully!");
    } catch (err) {
      console.error("handleStorePdf: Error storing PDF in MongoDB:", err);
      if (err.response) {
        console.error("handleStorePdf: Error response data:", err.response.data);
        console.error("handleStorePdf: Error response status:", err.response.status);
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      email: user?.email || "",
      password: user?.password || "",
      gender: user?.gender || "",
      dob: user?.dob || "",
      phone: user?.phone || "",
      bloodGroup: user?.bloodGroup || "",
      age: user?.age || "",
      emergencyContact: user?.emergencyContact || "",
      allergies: user?.allergies || "",
      vaccinationHistory: user?.vaccinationHistory || "",
      healthInsurancePolicy: user?.healthInsurancePolicy || "",
      doctorAssigned: user?.doctorAssigned || "",
      documents: user?.documents || ""
    });
    setPrescriptionImage(null);
    setIsEditing(false);
    setFormErrors({
      email: "",
      password: "",
      gender: "",
      phone: "",
      bloodGroup: "",
      age: "",
      emergencyContact: "",
      dob: "",
      allergies: "",
      vaccinationHistory: "",
      healthInsurancePolicy: ""
    });
  };

  const renderDisplayView = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
      <p>
        <span className="font-medium">Email:</span> {user?.email}
      </p>
      <p>
        <span className="font-medium">Password:</span> ********
      </p>
      <p>
        <span className="font-medium">Gender:</span> {user?.gender}
      </p>
      <p>
        <span className="font-medium">DOB:</span> {user?.dob}
      </p>
      <p>
        <span className="font-medium">Phone:</span> {user?.phone}
      </p>
      <p>
        <span className="font-medium">Blood Group:</span> {user?.bloodGroup}
      </p>
      <p>
        <span className="font-medium">Age:</span> {user?.age}
      </p>
      <p>
        <span className="font-medium">Emergency Contact:</span> {user?.emergencyContact}
      </p>

      <h3 className="text-lg font-semibold border-b pb-2 mt-6">Medical Information</h3>
      <div className="bg-gray-50 p-4 rounded">
        <p>
          <span className="font-medium">Allergies:</span> {user?.allergies || "None reported"}
        </p>
        <p>
          <span className="font-medium">Vaccination History:</span> {user?.vaccinationHistory || "No vaccination history provided"}
        </p>
        <p>
          <span className="font-medium">Health Insurance Policy:</span> {user?.healthInsurancePolicy || "No policy provided"}
        </p>
      </div>

      {pdfUrl && (
        <button
          onClick={() => setIsPdfOpen(true)}
          className="mt-4 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Preview PDF
        </button>
      )}
      <button
        onClick={handleEditClick}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Edit Profile
      </button>
    </div>
  );

  const renderEditView = () => (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information Section */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
        </div>
        
        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50 ${
              formErrors.email ? "border-red-500" : ""
            }`}
            autoComplete="email"
            required
          />
          {formErrors.email && (
            <p className="text-red-500 text-xs italic">{formErrors.email}</p>
          )}
        </div>
        
        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={(e) => handleFieldChange("password", e.target.value)}
              className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50 ${
                formErrors.password ? "border-red-500" : ""
              }`}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          {formErrors.password && (
            <p className="text-red-500 text-xs italic">{formErrors.password}</p>
          )}
        </div>
        
        {/* Gender */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={(e) => handleFieldChange("gender", e.target.value)}
            className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50 ${
              formErrors.gender ? "border-red-500" : ""
            }`}
            required
          >
            <option value="" disabled>
              Select your gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>
          {formErrors.gender && (
            <p className="text-red-500 text-xs italic">{formErrors.gender}</p>
          )}
        </div>
        
        {/* DOB */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={(e) => handleFieldChange("dob", e.target.value)}
            className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50 ${
              formErrors.dob ? "border-red-500" : ""
            }`}
            required
          />
          {formErrors.dob && (
            <p className="text-red-500 text-xs italic">{formErrors.dob}</p>
          )}
        </div>
        
        {/* Phone */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50 ${
              formErrors.phone ? "border-red-500" : ""
            }`}
            placeholder="Enter your phone number"
            autoComplete="tel"
            required
          />
          {formErrors.phone && (
            <p className="text-red-500 text-xs italic">{formErrors.phone}</p>
          )}
        </div>
        
        {/* Blood Group */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Blood Group
          </label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={(e) => handleFieldChange("bloodGroup", e.target.value)}
            className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50 ${
              formErrors.bloodGroup ? "border-red-500" : ""
            }`}
            required
          >
            <option value="" disabled>Select blood group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
          {formErrors.bloodGroup && (
            <p className="text-red-500 text-xs italic">{formErrors.bloodGroup}</p>
          )}
        </div>
        
        {/* Age */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Age
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={(e) => handleFieldChange("age", e.target.value)}
            className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50 ${
              formErrors.age ? "border-red-500" : ""
            }`}
            placeholder="Enter your age"
            min="0"
            max="120"
            required
          />
          {formErrors.age && (
            <p className="text-red-500 text-xs italic">{formErrors.age}</p>
          )}
        </div>
        
        {/* Emergency Contact */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Emergency Contact
          </label>
          <input
            type="tel"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={(e) => handleFieldChange("emergencyContact", e.target.value)}
            className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50 ${
              formErrors.emergencyContact ? "border-red-500" : ""
            }`}
            placeholder="Enter emergency contact number"
            required
          />
          {formErrors.emergencyContact && (
            <p className="text-red-500 text-xs italic">{formErrors.emergencyContact}</p>
          )}
        </div>

        {/* Medical Information Section */}
        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold border-b pb-2">Medical Information</h3>
        </div>
        
        {/* Allergies */}
        <div className="mb-4 md:col-span-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Allergies
          </label>
          <textarea
            name="allergies"
            value={formData.allergies}
            onChange={(e) => handleFieldChange("allergies", e.target.value)}
            className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50 ${
              formErrors.allergies ? "border-red-500" : ""
            }`}
            placeholder="List any known allergies (e.g., penicillin, nuts, etc.)"
            rows="3"
            maxLength="500"
          />
          {formErrors.allergies && (
            <p className="text-red-500 text-xs italic">{formErrors.allergies}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formData.allergies.length}/500 characters
          </p>
        </div>
        
        {/* Vaccination History */}
        <div className="mb-4 md:col-span-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Vaccination History
          </label>
          <textarea
            name="vaccinationHistory"
            value={formData.vaccinationHistory}
            onChange={(e) => handleFieldChange("vaccinationHistory", e.target.value)}
            className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50 ${
              formErrors.vaccinationHistory ? "border-red-500" : ""
            }`}
            placeholder="List your vaccination history (e.g., COVID-19, Flu shot, etc.)"
            rows="4"
            maxLength="1000"
          />
          {formErrors.vaccinationHistory && (
            <p className="text-red-500 text-xs italic">{formErrors.vaccinationHistory}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formData.vaccinationHistory.length}/1000 characters
          </p>
        </div>
        
        {/* Health Insurance Policy */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Health Insurance Policy
          </label>
          <input
            type="text"
            name="healthInsurancePolicy"
            value={formData.healthInsurancePolicy}
            onChange={(e) => handleFieldChange("healthInsurancePolicy", e.target.value)}
            className={`shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50 ${
              formErrors.healthInsurancePolicy ? "border-red-500" : ""
            }`}
            placeholder="Insurance policy number"
          />
          {formErrors.healthInsurancePolicy && (
            <p className="text-red-500 text-xs italic">{formErrors.healthInsurancePolicy}</p>
          )}
        </div>
        
        {/* Doctor Assigned */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Primary Physician
          </label>
          <input
            type="text"
            name="doctorAssigned"
            value={formData.doctorAssigned}
            onChange={(e) => handleFieldChange("doctorAssigned", e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50"
            placeholder="Your primary doctor's name"
          />
        </div>
      </div>
      
      {/* Prescription Image Upload */}
      <div className="mb-4 mt-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Prescription Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPrescriptionImage(e.target.files[0])}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-50"
        />
      </div>
      
      {/* Save and Cancel Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Updating..." : "Save"}
        </button>
        <button
          type="button"
          onClick={handleCancelEdit}
          className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            My Profile
          </h2>
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {isEditing ? renderEditView() : renderDisplayView()}
          {pdfUrl && (
            <div className="mt-4 text-center space-y-4">
              <a
                href={pdfUrl}
                download="profile.pdf"
                className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Download PDF
              </a>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={isPdfOpen}
        onRequestClose={() => setIsPdfOpen(false)}
        style={{
          content: { width: "80%", height: "80%", margin: "auto", overflow: "hidden" },
        }}
      >
        <div className="flex justify-end">
          <button onClick={() => setIsPdfOpen(false)} className="text-red-500 font-bold">
            Close
          </button>
        </div>
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        ) : (
          <p>No PDF available</p>
        )}
      </Modal>
    </div>
  );
};

export default MyProfile;