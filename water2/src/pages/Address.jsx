import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Home, MapPin, Building, Flag, Mail, 
  Phone, AlertCircle, FileText, ChevronDown, Download 
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { jsPDF } from "jspdf";

// Form configuration
const formConfig = {
  countries: [
    { name: "India", code: "IN" },
    { name: "United States", code: "US" },
    { name: "United Kingdom", code: "UK" },
    { name: "Canada", code: "CA" },
    { name: "Australia", code: "AU" },
    { name: "Germany", code: "DE" },
    { name: "France", code: "FR" },
    { name: "Japan", code: "JP" },
  ],
  indianStates: [
    { name: "Maharashtra", cities: ["Mumbai", "Pune", "Thane", "Nashik", "Nagpur"] },
    { name: "Delhi", cities: ["New Delhi", "Noida", "Gurgaon", "Faridabad"] },
    { name: "Karnataka", cities: ["Bangalore", "Mysore", "Hubli", "Mangalore"] },
    { name: "Tamil Nadu", cities: ["Chennai", "Coimbatore", "Madurai", "Salem"] },
    { name: "Gujarat", cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"] },
    { name: "Rajasthan", cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota"] },
    { name: "West Bengal", cities: ["Kolkata", "Howrah", "Durgapur", "Asansol"] },
  ],
  inputVariants: {
    focus: { scale: 0.98 },
    blur: { scale: 1 },
  },
  fields: [
    {
      name: "permanentAddress",
      label: "Permanent Address",
      icon: <Home />,
      required: true,
      type: "text",
      colSpan: 1
    },
    {
      name: "correspondenceAddress",
      label: "Correspondence Address",
      icon: <Home />,
      required: false,
      type: "text",
      colSpan: 1
    },
    {
      name: "lane",
      label: "Lane",
      icon: <MapPin />,
      required: false,
      type: "text",
      colSpan: 1
    },
    {
      name: "country",
      label: "Country",
      icon: <Flag />,
      required: true,
      type: "select",
      options: "countries",
      colSpan: 1
    },
    {
      name: "state",
      label: "State",
      icon: <Flag />,
      required: true,
      type: "select",
      options: "indianStates",
      showIf: (formData) => formData.country === "India",
      colSpan: 1
    },
    {
      name: "city",
      label: "City",
      icon: <Building />,
      required: true,
      type: "select",
      options: "cities",
      dynamicOptions: true,
      showIf: (formData) => formData.country === "India" && formData.state,
      colSpan: 1
    },
    {
      name: "city",
      label: "City",
      icon: <Building />,
      required: true,
      type: "text",
      showIf: (formData) => formData.country !== "India",
      colSpan: 1
    },
    {
      name: "postalCode",
      label: "Postal Code",
      icon: <MapPin />,
      required: true,
      type: "text",
      colSpan: 1
    },
    {
      name: "landmark",
      label: "Landmark",
      icon: <MapPin />,
      required: false,
      type: "text",
      colSpan: 1
    },
    {
      name: "contactNumber",
      label: "Contact Number",
      icon: <Phone />,
      required: true,
      type: "text",
      colSpan: 1
    },
    {
      name: "alternativeContact",
      label: "Alternative Contact",
      icon: <Phone />,
      required: false,
      type: "text",
      colSpan: 1
    },
    {
      name: "email",
      label: "Email",
      icon: <Mail />,
      required: true,
      type: "email",
      colSpan: 1
    },
    {
      name: "emergencyContact",
      label: "Emergency Contact",
      icon: <AlertCircle />,
      required: false,
      type: "text",
      colSpan: 1
    },
    {
      name: "addressType",
      label: "Address Type",
      icon: <ChevronDown />,
      required: false,
      type: "select",
      options: [
        { name: "home", label: "Home" },
        { name: "work", label: "Work" },
        { name: "other", label: "Other" }
      ],
      colSpan: 1
    },
    {
      name: "additionalNotes",
      label: "Additional Notes",
      icon: <FileText />,
      required: false,
      type: "textarea",
      colSpan: 2
    }
  ]
};

function InputField({ icon, name, label, value, onChange, error, textarea = false, required = false }) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {React.cloneElement(icon, { className: "h-5 w-5 text-gray-400" })}
        </div>
        {textarea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            className="block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={3}
            required={required}
          />
        ) : (
          <input
            type={name.includes("email") ? "email" : "text"}
            name={name}
            value={value}
            onChange={onChange}
            className="block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required={required}
          />
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function SelectField({ icon, name, label, value, onChange, options, error, required = false }) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="block w-full pl-10 pr-10 py-2 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required={required}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.code || option.name || option} value={option.name || option}>
              {option.label || option.name || option}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {React.cloneElement(icon, { className: "h-5 w-5 text-gray-400" })}
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// LocalStorage helper functions
const loadFormDataFromStorage = () => {
  try {
    const savedData = localStorage.getItem('addressFormData');
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error("Error loading form data from localStorage:", error);
    return null;
  }
};

const saveFormDataToStorage = (data) => {
  try {
    localStorage.setItem('addressFormData', JSON.stringify(data));
  } catch (error) {
    console.error("Error saving form data to localStorage:", error);
  }
};

const clearFormDataFromStorage = () => {
  try {
    localStorage.removeItem('addressFormData');
  } catch (error) {
    console.error("Error clearing form data from localStorage:", error);
  }
};

export default function Address() {
  const { user: contextUser } = useContext(AppContext);
  const [formData, setFormData] = useState({
    permanentAddress: "",
    correspondenceAddress: "",
    lane: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    landmark: "",
    contactNumber: "",
    alternativeContact: "",
    email: contextUser?.email || "",
    emergencyContact: "",
    addressType: "",
    additionalNotes: "",
  });

  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      // First try to load from localStorage
      const savedData = loadFormDataFromStorage();
      
      if (savedData) {
        setFormData(savedData);
        setIsEditing(false); // View mode if data exists
        return;
      }

      // If no localStorage data, fetch from API
      if (contextUser?.email) {
        try {
          setLoading(true);
          const response = await axios.get('http://localhost:4000/api/user', {
            params: { email: contextUser?.email }
          });
          
          if (response.data.success && response.data.user.address) {
            const apiData = {
              ...response.data.user.address,
              email: contextUser?.email
            };
            setFormData(apiData);
            saveFormDataToStorage(apiData);
            setIsEditing(false); // View mode if data exists
          } else {
            setIsEditing(true); // Edit mode if no data exists
          }
        } catch (error) {
          console.error("Error fetching address:", error);
          setIsEditing(true); // Edit mode if error occurs
        } finally {
          setLoading(false);
        }
      }
    };

    loadInitialData();
  }, [contextUser?.email]);

  // Save to localStorage whenever formData changes
  useEffect(() => {
    saveFormDataToStorage(formData);
  }, [formData]);

  // Update cities when state changes
  useEffect(() => {
    if (formData.country === "India" && formData.state) {
      const selectedState = formConfig.indianStates.find(s => s.name === formData.state);
      if (selectedState) {
        setCities(selectedState.cities);
      } else {
        setCities([]);
      }
    } else {
      setCities([]);
    }
  }, [formData.state, formData.country]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "state" && { city: "" }),
      ...(name === "country" && { state: "", city: "" })
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    const emergencyContactRegex = /^[0-9]{10}$/;
    const postalCodeRegex = formData.country === "India" ? /^[1-9][0-9]{5}$/ : /^[0-9]{4,10}$/;

    formConfig.fields.forEach(field => {
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = "Required";
      }
    });

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!phoneRegex.test(formData.contactNumber)) {
      newErrors.contactNumber = "Invalid phone number (10-15 digits)";
    }

    if (formData.alternativeContact && !phoneRegex.test(formData.alternativeContact)) {
      newErrors.alternativeContact = "Invalid phone number (10-15 digits)";
    }

    if (formData.emergencyContact && !emergencyContactRegex.test(formData.emergencyContact)) {
      newErrors.emergencyContact = "Must be exactly 10 digits";
    }

    if (!postalCodeRegex.test(formData.postalCode)) {
      newErrors.postalCode = formData.country === "India" ? "Must be 6 digits" : "Invalid format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await axios.put('http://localhost:4000/api/user/update-address', {
          ...formData,
          email: contextUser?.email
        });
        
        if (response.data.success) {
          setUpdateMessage("Address saved successfully!");
          saveFormDataToStorage({
            ...formData,
            email: contextUser?.email
          });
          setIsEditing(false); // Switch to view mode after successful save
        } else {
          setUpdateMessage(response.data.message || "Error saving address");
        }
      } catch (error) {
        setUpdateMessage(error.response?.data?.message || "Error saving address");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    const savedData = loadFormDataFromStorage();
    if (savedData) {
      setFormData(savedData);
    }
    setIsEditing(false);
    setErrors({});
    setUpdateMessage("");
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the form? All unsaved changes will be lost.")) {
      const newFormData = {
        permanentAddress: "",
        correspondenceAddress: "",
        lane: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        landmark: "",
        contactNumber: "",
        alternativeContact: "",
        email: contextUser?.email || "",
        emergencyContact: "",
        addressType: "",
        additionalNotes: "",
      };
      setFormData(newFormData);
      clearFormDataFromStorage();
      setErrors({});
      setUpdateMessage("Form has been reset");
      setIsEditing(true);
    }
  };

  const generatePDF = () => {
    if (!validateForm()) {
      setUpdateMessage("Please complete all required fields");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Address Details", 10, 10);
    doc.setFontSize(12);
    
    let y = 20;
    Object.entries(formData).forEach(([key, value]) => {
      if (value) { // Only include fields with values
        doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, 10, y);
        y += 10;
      }
    });
    
    doc.save("address_details.pdf");
  };

  const renderField = (field) => {
    if (field.showIf && !field.showIf(formData)) return null;

    const commonProps = {
      key: field.name,
      name: field.name,
      label: field.label,
      value: formData[field.name],
      onChange: handleChange,
      error: errors[field.name],
      required: field.required,
      icon: field.icon,
      disabled: !isEditing // Disable fields when not in edit mode
    };

    if (field.type === "select") {
      let options = [];
      if (field.options === "countries") {
        options = formConfig.countries;
      } else if (field.options === "indianStates") {
        options = formConfig.indianStates;
      } else if (field.options === "cities") {
        options = cities.map(city => ({ name: city }));
      } else if (Array.isArray(field.options)) {
        options = field.options;
      }

      return (
        <div className={`col-span-${field.colSpan || 1}`}>
          <SelectField {...commonProps} options={options} />
        </div>
      );
    }

    return (
      <div className={`col-span-${field.colSpan || 1}`}>
        <InputField {...commonProps} textarea={field.type === "textarea"} />
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Address Details</h2>
            <div className="flex gap-2">
              {!isEditing && (
                <motion.button
                  type="button"
                  onClick={handleEdit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Edit Address
                </motion.button>
              )}
              <motion.button
                type="button"
                onClick={generatePDF}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md"
              >
                <Download size={18} />
                Download PDF
              </motion.button>
              {isEditing && (
                <motion.button
                  type="button"
                  onClick={handleReset}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md"
                >
                  Reset Form
                </motion.button>
              )}
            </div>
          </div>

          {updateMessage && (
            <div className={`mb-4 p-3 rounded-md ${
              updateMessage.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {updateMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formConfig.fields.map(renderField)}
          </div>

          {isEditing && (
            <div className="flex gap-4 mt-6">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                className={`flex-1 py-2 px-4 rounded-md ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {loading ? "Saving..." : "Save Address"}
              </motion.button>
              <motion.button
                type="button"
                onClick={handleCancel}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </motion.button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}