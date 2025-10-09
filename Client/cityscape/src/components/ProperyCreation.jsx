// PropertyForm.jsx
import React, { useState, useEffect } from "react";
import DashboardSidebar from '../common/Dashboard_Sidebar';
import DashboardSidebar2 from '../common/Dashboard_Sidebar2';
import DashboardNavbar from '../common/Dashboard_Navbar';

import {
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  DatePicker,
  Button,
  Divider,
  Row,
  Col,
  Card,
  Space,
  message,
  Layout, Table, Tag,   Modal, Typography,  Spin, Breadcrumb,   Image
} from "antd";
import { PlusOutlined, UploadOutlined, MinusCircleOutlined,EyeOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, SearchOutlined ,HomeOutlined} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import url from '../url';
const { TextArea } = Input;
const { Option } = Select;
const { Content } = Layout;
/**
 * Single-page property create/update form.
 * - Replace LOCATIONIQ_API_KEY as needed.
 * - Submits a multipart/form-data payload matching your backend controller.
 */
export default function PropertyForm({ initialData = null, apiBase = "/api/properties" }) {
  const [form] = Form.useForm();

  // ---------- Core app state ----------
  const [nearbyFacilities, setNearbyFacilities] = useState(
    initialData?.nearbyFacilities ?? [{ facilityType: "", facilityName: "", distance: "" }]
  );
  const [floorPlans, setFloorPlans] = useState(
    initialData?.floorPlans ?? [{ floorName: "", towerName: "", shortDescription: "", priceRange: "", photo: null }]
  );
  const [developerInfo, setDeveloperInfo] = useState(
    initialData?.developerInfo ?? { developerName: "", developerDescription: "", developerLogo: null }
  );

  // Files & previews
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [coverPreview, setCoverPreview] = useState(initialData?.coverPhotoUrl || null);

  const [additionalPhotos, setAdditionalPhotos] = useState([]); // File[]
  const [additionalPreviews, setAdditionalPreviews] = useState(initialData?.additionalPhotosUrls || []);

  const [layoutMaps, setLayoutMaps] = useState([]); // File[]
  const [layoutPreviews, setLayoutPreviews] = useState(initialData?.layoutMapsUrls || []);

  const [floorPlanFiles, setFloorPlanFiles] = useState([]); // parallel files array for floorPlans
  const [devLogoFile, setDevLogoFile] = useState(null);
  const [devLogoPreview, setDevLogoPreview] = useState(initialData?.developerInfo?.developerLogoUrl || null);

  const [loading, setLoading] = useState(false);

  // Helpful values (replace LOCATIONIQ_API_KEY with your own)
  const LOCATIONIQ_API_KEY = "pk.c84a46da67c826897a94d8b73b7c68e7"; // <<-- replace
  const API_BASE = apiBase; // e.g. '/api/properties' or full URL

  // --------------- initialize from initialData ----------------
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        title: initialData.title || "",
        shortDescription: initialData.shortDescription || "",
        longDescription: initialData.longDescription || "",
        priceRange: initialData.priceRange || "",
        budgetType: initialData.budgetType || "",
        city: initialData.city || "",
        suburb: initialData.suburb || "",
        district: initialData.district || "",
        state: initialData.state || "",
        pincode: initialData.pincode || "",
        road: initialData.road || "",
        country: initialData.country || "",
        continent: initialData.continent || "",
        timezone: initialData.timezone || "",
        isoCode: initialData.isoCode || "",
        latitude: initialData.latitude ?? "",
        longitude: initialData.longitude ?? "",
        googleMapLink: initialData.googleMapLink || "",
        propertyType: initialData.propertyType || "",
        status: initialData.status || "",
        bedrooms: initialData.bedrooms || "",
        bathrooms: initialData.bathrooms ?? null,
        furnishedStatus: initialData.furnishedStatus || "",
        parkingAvailable: initialData.parkingAvailable ?? false,
        launchDate: initialData.launchDate ? dayjs(initialData.launchDate) : null,
        completionDate: initialData.completionDate ? dayjs(initialData.completionDate) : null,
        floorNumber: initialData.floorNumber ?? null,
        numberOfTowers: initialData.numberOfTowers ?? null,
        carpetArea: initialData.carpetArea ?? "",
        totalArea: initialData.totalArea ?? "",
        facing: initialData.facing || "",
        amenities: initialData.amenities ? initialData.amenities.split(",") : [],
      });

      if (initialData.nearbyFacilities) setNearbyFacilities(initialData.nearbyFacilities);
      if (initialData.floorPlans) {
        // keep metadata, but no binary file attached in UI
        setFloorPlans(initialData.floorPlans.map(fp => ({ ...fp, photo: null })));
      }
      if (initialData.developerInfo) setDeveloperInfo(initialData.developerInfo);
      if (initialData.coverPhotoUrl) setCoverPreview(initialData.coverPhotoUrl);
      if (initialData.developerInfo?.developerLogoUrl) setDevLogoPreview(initialData.developerInfo.developerLogoUrl);
      if (initialData.additionalPhotosUrls) setAdditionalPreviews(initialData.additionalPhotosUrls);
      if (initialData.layoutMapsUrls) setLayoutPreviews(initialData.layoutMapsUrls);
    }
  }, [initialData, form]);

  // ----------------- Utilities -----------------
  const slugify = (text = "") =>
    text
      .toString()
      .normalize("NFKD")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");

  // Extract lat/lng from Google Maps link (expects @lat,lng in link)
  const extractLatLngFromMapsLink = (link) => {
    if (!link) return null;
    // patterns can vary; attempt multiple patterns
    const atMatch = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };

    // sometimes in place?q=lat,lng
    const qMatch = link.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };

    return null;
  };

  // Convert File -> DataURL for previews
  const fileToDataUrl = (file) =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = (e) => res(e.target.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    });

  // ----------------- Nearby facilities auto-fetch -----------------
  /**
   * Fetch a small set of nearby facilities for given lat/lng.
   * This implementation tries several categories and picks top results (one per category)
   * until we have at least 5 items (or we exhaust categories).
   */
  const fetchNearbyFacilitiesAuto = async (lat, lng) => {
    if (!LOCATIONIQ_API_KEY) {
      message.warning("No location API key configured for nearby facilities auto-fill.");
      return;
    }

    // categories to try (label shown in UI, and tag used in LocationIQ). You may adjust tags.
    const categories = [
      { tag: "school", label: "School" },
      { tag: "hospital", label: "Hospital" },
      { tag: "park", label: "Park" },
      { tag: "restaurant", label: "Restaurant" },
      { tag: "shopping_mall", label: "Shopping Mall" },
      { tag: "bus_stop", label: "Bus Stop" },
      { tag: "supermarket", label: "Supermarket" },
      { tag: "atm", label: "ATM" },
    ];

    try {
      const collected = [];

      // Try to fetch for each category; pick up to 2 per category if available
      for (let cat of categories) {
        // Stop early if we already have 5 or more
        if (collected.length >= 5) break;

        // LocationIQ' nearby endpoint (nearby.php) supports tag param to filter OSM tags.
        // We'll ask for a small radius (2k-3k meters) and read returned array.
        const url = `https://us1.locationiq.com/v1/nearby.php`;
        try {
          const res = await axios.get(url, {
            params: {
              key: LOCATIONIQ_API_KEY,
              lat,
              lon: lng,
              tag: cat.tag,
              radius: 3000, // meters
              format: "json",
            },
          });

          if (Array.isArray(res.data) && res.data.length > 0) {
            // push up to 2 results from this category (or 1 if you prefer)
            for (let i = 0; i < Math.min(2, res.data.length) && collected.length < 8; i++) {
              const item = res.data[i];
              // item may have name, type, distance (distance in meters), or address
              const name = item.name || item.display_name || (item.address && item.address[cat.tag]) || "Unknown";
              const distStr = item.distance ? `${(Number(item.distance) / 1000).toFixed(2)} km` : "";
              collected.push({
                facilityType: cat.label,
                facilityName: name,
                distance: distStr,
              });
              // Stop once we reached minimum 5 - but we only break outer loop later
            }
          }
        } catch (innerErr) {
          // ignore category fetch errors and continue with next category
          // console.warn("Nearby fetch failed for", cat.tag, innerErr);
        }
      }

      // Fallback: if none found, leave single empty entry
      if (collected.length === 0) {
        setNearbyFacilities([{ facilityType: "", facilityName: "", distance: "" }]);
        message.info("No nearby places were found automatically.");
        return;
      }

      // Ensure at least 5 entries - if fewer, pad empty ones
      while (collected.length < 5) {
        collected.push({ facilityType: "", facilityName: "", distance: "" });
      }

      setNearbyFacilities(collected.slice(0, Math.max(5, collected.length)));
      message.success("Nearby facilities auto-filled. You can edit or remove items before submit.");
    } catch (err) {
      console.error("fetchNearbyFacilitiesAuto error:", err);
      message.warning("Could not fetch nearby facilities automatically. You can add them manually.");
    }
  };

  // ----------------- fetch location and then auto nearby -----------------
  const fetchLocationFromGoogleLink = async () => {
    const link = form.getFieldValue("googleMapLink");
    if (!link) return message.warning("Paste Google Map link first");

    const coords = extractLatLngFromMapsLink(link);
    if (!coords) {
      return message.error(
        "Unable to extract coordinates from Google Maps link. Paste a full maps link (with @lat,lng)."
      );
    }

    try {
      const res = await axios.get(
        `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_API_KEY}&lat=${coords.lat}&lon=${coords.lng}&format=json`
      );

      if (!res.data || !res.data.address) {
        return message.error("Unable to fetch location details from LocationIQ.");
      }

      const addr = res.data.address;

      form.setFieldsValue({
        latitude: coords.lat,
        longitude: coords.lng,
        city: addr.city || addr.town || addr.village || "",
        district: addr.county || "",
        state: addr.state || "",
        country: addr.country || "",
        pincode: addr.postcode || "",
        road: addr.road || "",
        suburb: addr.suburb || "",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
        isoCode: addr.country_code ? addr.country_code.toUpperCase() : "",
      });

      message.success("Location details populated from the map link.");

      // Now auto-fetch nearby facilities (at least 5)
      await fetchNearbyFacilitiesAuto(coords.lat, coords.lng);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch location from LocationIQ.");
    }
  };

  // ----------------- Nearby Facilities operations -----------------
  const addNearbyFacility = () => {
    setNearbyFacilities((prev) => [...prev, { facilityType: "", facilityName: "", distance: "" }]);
  };
  const updateNearbyFacility = (index, key, value) => {
    setNearbyFacilities((prev) => prev.map((p, i) => (i === index ? { ...p, [key]: value } : p)));
  };
  const removeNearbyFacility = (index) => {
    setNearbyFacilities((prev) => prev.filter((_, i) => i !== index));
  };

  // ----------------- Floor Plans operations -----------------
  const addFloorPlan = () => {
    setFloorPlans((prev) => [...prev, { floorName: "", towerName: "", shortDescription: "", priceRange: "", photo: null }]);
  };
  const updateFloorPlan = (index, key, value) => {
    setFloorPlans((prev) => prev.map((p, i) => (i === index ? { ...p, [key]: value } : p)));
  };
  const removeFloorPlan = (index) => {
    setFloorPlans((prev) => prev.filter((_, i) => i !== index));
    setFloorPlanFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const onSelectFloorPlanPhoto = (index, file) => {
    updateFloorPlan(index, "photo", file);
    setFloorPlanFiles((prev) => {
      const copy = [...prev];
      copy[index] = file;
      return copy;
    });
  };

  // ----------------- File handlers (cover, additional, layout, developer logo) -----------------
  const handleCoverChange = (file) => {
    setCoverPhoto(file);
    const reader = new FileReader();
    reader.onload = (e) => setCoverPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleAdditionalPhotosChange = (files) => {
    const fileArr = Array.from(files);
    setAdditionalPhotos(fileArr);
    // generate previews
    Promise.all(fileArr.map((f) => fileToDataUrl(f))).then((previews) => setAdditionalPreviews(previews));
  };

  const handleLayoutMapsChange = (files) => {
    const fileArr = Array.from(files);
    setLayoutMaps(fileArr);
    Promise.all(fileArr.map((f) => fileToDataUrl(f))).then((previews) => setLayoutPreviews(previews));
  };

  const handleDevLogoChange = (file) => {
    setDevLogoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setDevLogoPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  // ----------------- Submit -----------------
  const handleSubmit = async (vals) => {
    try {
      setLoading(true);

      // Prepare FormData
      const fd = new FormData();

      // Basic fields
      const title = vals.title || "";
      fd.append("title", title);
      fd.append("slug", slugify(title));

      const fieldsToAppend = [
        "shortDescription",
        "longDescription",
        "priceRange",
        "budgetType",
        "city",
        "suburb",
        "district",
        "state",
        "pincode",
        "road",
        "country",
        "continent",
        "timezone",
        "isoCode",
        "googleMapLink",
        "propertyType",
        "status",
        "furnishedStatus",
        "facing",
      ];
      fieldsToAppend.forEach((k) => {
        if (vals[k] !== undefined && vals[k] !== null) fd.append(k, vals[k]);
      });
       
      // numeric and boolean fields
      if (vals.latitude) fd.append("latitude", vals.latitude);
      if (vals.longitude) fd.append("longitude", vals.longitude);
      if (vals.bathrooms !== undefined && vals.bathrooms !== null) fd.append("bathrooms", String(vals.bathrooms));
      fd.append("parkingAvailable", vals.parkingAvailable ? "true" : "false");
      if (vals.floorNumber !== undefined && vals.floorNumber !== null) fd.append("floorNumber", String(vals.floorNumber));
      if (vals.numberOfTowers !== undefined && vals.numberOfTowers !== null) fd.append("numberOfTowers", String(vals.numberOfTowers));
      if (vals.carpetArea !== undefined && vals.carpetArea !== null) fd.append("carpetArea", String(vals.carpetArea));
      if (vals.totalArea !== undefined && vals.totalArea !== null) fd.append("totalArea", String(vals.totalArea));
      if (vals.bedrooms) {
        fd.append("bedrooms", typeof vals.bedrooms === "string" ? vals.bedrooms : (Array.isArray(vals.bedrooms) ? vals.bedrooms.join(",") : String(vals.bedrooms)));
      }

      // dates
      if (vals.launchDate) fd.append("launchDate", dayjs(vals.launchDate).toISOString());
      if (vals.completionDate) fd.append("completionDate", dayjs(vals.completionDate).toISOString());

      // amenities
   if (vals.amenities && Array.isArray(vals.amenities)) {
  const ids = vals.amenities.map(a => a.id ?? a);
  fd.append("amenities", JSON.stringify(ids));
}



      // JSON fields: nearbyFacilities, floorPlans, developerInfo
      fd.append("nearbyFacilities", JSON.stringify(nearbyFacilities));

      const floorPlansMeta = floorPlans.map((fp) => {
        const { photo, ...meta } = fp;
        return meta;
      });
      fd.append("floorPlans", JSON.stringify(floorPlansMeta));

      fd.append("developerInfo", JSON.stringify({
        developerName: developerInfo.developerName,
        developerDescription: developerInfo.developerDescription,
      }));

      // Files
      if (coverPhoto) fd.append("coverPhoto", coverPhoto);

      additionalPhotos.forEach((f) => fd.append("additionalPhotos", f));
      layoutMaps.forEach((f) => fd.append("layoutMaps", f));

      if (devLogoFile) fd.append("developerLogo", devLogoFile);

      // floor plan images appended in same order as floorPlans array
      for (let i = 0; i < floorPlans.length; i++) {
        const file = floorPlans[i].photo;
        if (file) fd.append("floorPlans", file);
      }
      const token = localStorage.getItem('token');
      // final POST
      const res = await axios.post(`${url.API_URL}/admin/property/createproperty`, fd, {
        headers: { "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
         },
      });

      message.success(res?.data?.message || "Property submitted successfully.");


      // Optional: reset or redirect
    } catch (err) {
      console.error(err);
      message.error(err?.response?.data?.message || "Failed to submit property.");
    } finally {
      setLoading(false);
    }
  };


  if (!localStorage.getItem('token')) {
    window.location.href = '/admin/login';
    return null;
  }

  // ----------------- Render -----------------
  return (
    <>
  <Layout style={{ minHeight: '100vh' }}>
      {JSON.parse(localStorage.getItem('user')).role === 'admin' ? <DashboardSidebar /> : <DashboardSidebar2 />}
      <Layout>
        <DashboardNavbar />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Breadcrumb style={{ marginBottom: 24 }} items={[{ title: 'Properties' }, { title: 'All Properties' }]} />
      
       <Card style={{ maxWidth: 1100, margin: "20px auto", padding: 16 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          parkingAvailable: false,
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 16 }}>Create Property</h2>

        <Divider>Basic Info</Divider>
        <Row gutter={16}>
          <Col xs={24} md={16}>
            <Form.Item name="title" label="Title" rules={[{ required: true, message: "Title required" }]}>
              <Input
                placeholder="Property title"
                onBlur={() => {
                  // auto slug generation preview (optional)
                  const t = form.getFieldValue("title") || "";
                  form.setFieldsValue({ slugPreview: slugify(t) });
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="slugPreview" label="Slug (auto)" tooltip="Auto-generated from title">
              <Input placeholder="Slug will auto-generate" readOnly />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="shortDescription" label="Short Description" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="longDescription" label="Long Description" rules={[{ required: true }]}>
          <TextArea rows={4} />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item name="priceRange" label="Price Range" rules={[{ required: true }]}>
              <Input placeholder="e.g. 50L - 1Cr" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="budgetType" label="Budget Type" rules={[{ required: true }]}>
              <Select placeholder="Select">
                <Option value="Budgeted">Budgeted</Option>
                <Option value="Mid-Budget">Mid-Budget</Option>
                <Option value="Premium-Budget">Premium-Budget</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="propertyType" label="Property Type" rules={[{ required: true }]}>
              <Select placeholder="Select">
                <Option value="Flat">Flat</Option>
                <Option value="Apartment">Apartment</Option>
                <Option value="Independent House">Independent House</Option>
                <Option value="Villa">Villa</Option>
                <Option value="Plots">Plots</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select placeholder="Status">
                <Option value="Launching Soon">Launching Soon</Option>
                <Option value="Ready to Move In">Ready to Move In</Option>
                <Option value="Under Construction">Under Construction</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="bedrooms" label="Bedrooms (comma separated)">
              <Input placeholder="e.g. 2,3,4" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="bathrooms" label="Bathrooms">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item name="furnishedStatus" label="Furnished Status">
              <Select placeholder="Select">
                <Option value="Fully Furnished">Fully Furnished</Option>
                <Option value="Semi-Furnished">Semi-Furnished</Option>
                <Option value="Unfurnished">Unfurnished</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="parkingAvailable" label="Parking Available" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="facing" label="Facing">
              <Select placeholder="Select">
                <Option value="East Facing">East Facing</Option>
                <Option value="West Facing">West Facing</Option>
                <Option value="North Facing">North Facing</Option>
                <Option value="South Facing">South Facing</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider>Location</Divider>

        <Form.Item name="googleMapLink" label="Google Map Link" extra="Paste a Google Maps link containing @lat,lng and click 'Fetch'">
          <Input
            placeholder="https://www.google.com/maps/place/.../@12.3456,78.9012,17z"
            suffix={<Button onClick={fetchLocationFromGoogleLink}>Fetch</Button>}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="city" label="City">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="suburb" label="Suburb">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item name="district" label="District">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="state" label="State">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="pincode" label="Pincode">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item name="road" label="Road">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="country" label="Country">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="continent" label="Continent">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item name="timezone" label="Timezone">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="isoCode" label="ISO Code">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item name="latitude" label="Latitude">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item name="longitude" label="Longitude">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider>Sizes & Dates</Divider>
        <Row gutter={16}>
          <Col xs={24} md={6}>
            <Form.Item name="floorNumber" label="Floor Number">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item name="numberOfTowers" label="Towers">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item name="carpetArea" label="Carpet Area (sqft)">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item name="totalArea" label="Total Area">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="launchDate" label="Launch Date">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="completionDate" label="Completion Date">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Divider>Amenities & Nearby Facilities</Divider>

        <Form.Item name="amenities" label="Amenities (choose)">
          {/* Example static list; replace with dynamic fetch from backend if needed */}
          <Select mode="multiple" placeholder="Select amenities">
            <Option value="1">Swimming Pool</Option>
            <Option value="2">Gym</Option>
            <Option value="3">Club House</Option>
            <Option value="4">Playground</Option>
            <Option value="5">Parking</Option>
          </Select>
        </Form.Item>

        <div style={{ marginBottom: 12 }}>
          <Space align="center">
            <h4 style={{ margin: 0 }}>Nearby Facilities</h4>
            <Button type="link" onClick={addNearbyFacility} icon={<PlusOutlined />}>Add</Button>
          </Space>
        </div>

        {nearbyFacilities.map((nf, i) => (
          <Card key={i} size="small" style={{ marginBottom: 8 }}>
            <Row gutter={8} align="middle">
              <Col xs={24} md={8}>
                <Input
                  placeholder="Type (School / Hospital)"
                  value={nf.facilityType}
                  onChange={(e) => updateNearbyFacility(i, "facilityType", e.target.value)}
                />
              </Col>
              <Col xs={24} md={10}>
                <Input
                  placeholder="Name"
                  value={nf.facilityName}
                  onChange={(e) => updateNearbyFacility(i, "facilityName", e.target.value)}
                />
              </Col>
              <Col xs={24} md={4}>
                <Input
                  placeholder="Distance (km)"
                  value={nf.distance}
                  onChange={(e) => updateNearbyFacility(i, "distance", e.target.value)}
                />
              </Col>
              <Col xs={24} md={2}>
                <Button danger icon={<MinusCircleOutlined />} onClick={() => removeNearbyFacility(i)} />
              </Col>
            </Row>
          </Card>
        ))}

        <Divider>Floor Plans</Divider>

        {floorPlans.map((fp, idx) => (
          <Card key={idx} size="small" style={{ marginBottom: 10 }}>
            <Row gutter={8} align="middle">
              <Col xs={24} md={5}>
                <Input
                  placeholder="Floor Name"
                  value={fp.floorName}
                  onChange={(e) => updateFloorPlan(idx, "floorName", e.target.value)}
                />
              </Col>
              <Col xs={24} md={5}>
                <Input
                  placeholder="Tower Name"
                  value={fp.towerName}
                  onChange={(e) => updateFloorPlan(idx, "towerName", e.target.value)}
                />
              </Col>
              <Col xs={24} md={8}>
                <Input
                  placeholder="Short Description"
                  value={fp.shortDescription}
                  onChange={(e) => updateFloorPlan(idx, "shortDescription", e.target.value)}
                />
              </Col>
              <Col xs={24} md={3}>
                <Input
                  placeholder="Price Range"
                  value={fp.priceRange}
                  onChange={(e) => updateFloorPlan(idx, "priceRange", e.target.value)}
                />
              </Col>
              <Col xs={24} md={2}>
                <label style={{ display: "block" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) onSelectFloorPlanPhoto(idx, f);
                    }}
                  />
                </label>
              </Col>
              <Col xs={24} md={1}>
                <Button danger icon={<MinusCircleOutlined />} onClick={() => removeFloorPlan(idx)} />
              </Col>
            </Row>
          </Card>
        ))}

        <Button type="dashed" onClick={addFloorPlan} block icon={<PlusOutlined />}>Add Floor Plan</Button>

        <Divider>Developer Info</Divider>
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Input
              placeholder="Developer Name"
              value={developerInfo.developerName}
              onChange={(e) => setDeveloperInfo(prev => ({ ...prev, developerName: e.target.value }))}
            />
          </Col>
          <Col xs={24} md={12}>
            <label>
              Developer Logo
              <input
                type="file"
                accept="image/*"
                style={{ display: "block", marginTop: 6 }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    handleDevLogoChange(f);
                    setDeveloperInfo(prev => ({ ...prev, developerLogo: f }));
                  }
                }}
              />
            </label>
          </Col>
        </Row>
        <div style={{ marginTop: 8, marginBottom: 12 }}>
          <TextArea
            rows={3}
            placeholder="Developer Description"
            value={developerInfo.developerDescription}
            onChange={(e) => setDeveloperInfo(prev => ({ ...prev, developerDescription: e.target.value }))}
          />
        </div>

        <Divider>Media Uploads</Divider>

        <Row gutter={12}>
          <Col xs={24} md={12}>
            <label>Cover Photo</label>
            <input
              type="file"
              accept="image/*"
              style={{ display: "block", marginTop: 6 }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleCoverChange(f);
              }}
            />
            {coverPreview && <img src={coverPreview} alt="cover" style={{ maxWidth: 200, marginTop: 8 }} />}
          </Col>

          <Col xs={24} md={12}>
            <label>Developer Logo Preview</label>
            <div>
              {devLogoPreview && <img src={devLogoPreview} alt="devlogo" style={{ maxWidth: 120, display: "block", marginTop: 8 }} />}
            </div>
          </Col>
        </Row>

        <div style={{ marginTop: 12 }}>
          <label>Additional Photos</label>
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: "block", marginTop: 6 }}
            onChange={(e) => {
              if (e.target.files) handleAdditionalPhotosChange(e.target.files);
            }}
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {additionalPreviews.map((p, i) => (
              <img key={i} src={p} alt={`add-${i}`} style={{ width: 90, height: 70, objectFit: "cover", borderRadius: 4 }} />
            ))}
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Layout Maps</label>
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: "block", marginTop: 6 }}
            onChange={(e) => { if (e.target.files) handleLayoutMapsChange(e.target.files); }}
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {layoutPreviews.map((p, i) => (
              <img key={i} src={p} alt={`layout-${i}`} style={{ width: 90, height: 70, objectFit: "cover", borderRadius: 4 }} />
            ))}
          </div>
        </div>

        <Divider />

        <Button type="primary" htmlType="submit" loading={loading} block>
          Submit Property
        </Button>
      </Form>
    </Card>
        </Content>
      </Layout>
    </Layout>
    </>
   
  );
}
