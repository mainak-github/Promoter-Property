import { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  Space,
  DatePicker,
  Upload,
  message,
  Image,
  Spin,
  Divider,
  Layout,
  Typography,
  Breadcrumb,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import url from '../url';
import DashboardSidebar from '../common/Dashboard_Sidebar';
import DashboardSidebar2 from '../common/Dashboard_Sidebar2';
import DashboardNavbar from '../common/Dashboard_Navbar';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const { Content } = Layout;
const { Title, Text } = Typography;

const PropertyUpdation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  // LocationIQ API Key
  const LOCATIONIQ_API_KEY = "pk.c84a46da67c826897a94d8b73b7c68e7";

  // Nearby facilities state
  const [nearbyFacilities, setNearbyFacilities] = useState([]);

  // Your existing state for images and structured data
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [newAdditionalPhotos, setNewAdditionalPhotos] = useState([]);
  const [newFloorPlanPhotos, setNewFloorPlanPhotos] = useState([]);
  const [developerLogo, setDeveloperLogo] = useState(null);
  const [newLayoutMaps, setNewLayoutMaps] = useState([]);

  const [existingCoverPhoto, setExistingCoverPhoto] = useState(null);
  const [existingAdditionalPhotos, setExistingAdditionalPhotos] = useState([]);
  const [existingFloorPlanPhotos, setExistingFloorPlanPhotos] = useState([]);
  const [existingDeveloperLogo, setExistingDeveloperLogo] = useState(null);
  const [existingLayoutMaps, setExistingLayoutMaps] = useState([]);

  // Extract lat/lng from Google Maps link
  const extractLatLngFromMapsLink = (link) => {
    if (!link) return null;
    const atMatch = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    const qMatch = link.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
    return null;
  };

  // Fetch nearby facilities automatically
  const fetchNearbyFacilitiesAuto = async (lat, lng) => {
    if (!LOCATIONIQ_API_KEY) {
      message.warning("No location API key configured for nearby facilities auto-fill.");
      return;
    }

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

      for (let cat of categories) {
        if (collected.length >= 5) break;

        const url = `https://us1.locationiq.com/v1/nearby.php`;
        try {
          const res = await axios.get(url, {
            params: {
              key: LOCATIONIQ_API_KEY,
              lat,
              lon: lng,
              tag: cat.tag,
              radius: 3000,
              format: "json",
            },
          });

          if (Array.isArray(res.data) && res.data.length > 0) {
            for (let i = 0; i < Math.min(2, res.data.length) && collected.length < 8; i++) {
              const item = res.data[i];
              const name = item.name || item.display_name || (item.address && item.address[cat.tag]) || "Unknown";
              const distStr = item.distance ? `${(Number(item.distance) / 1000).toFixed(2)} km` : "";
              collected.push({
                facilityType: cat.label,
                facilityName: name,
                distance: distStr,
              });
            }
          }
        } catch (innerErr) {
          // ignore and continue
        }
      }

      if (collected.length === 0) {
        message.info("No nearby places were found automatically.");
        return;
      }

      while (collected.length < 5) {
        collected.push({ facilityType: "", facilityName: "", distance: "" });
      }

      // Update form with new nearby facilities
      form.setFieldsValue({
        nearbyFacilities: collected.slice(0, Math.max(5, collected.length))
      });

      message.success("Nearby facilities auto-filled. You can edit or remove items before submit.");
    } catch (err) {
      console.error("fetchNearbyFacilitiesAuto error:", err);
      message.warning("Could not fetch nearby facilities automatically. You can add them manually.");
    }
  };

  // Fetch location from Google Maps link
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

      // Now auto-fetch nearby facilities
      await fetchNearbyFacilitiesAuto(coords.lat, coords.lng);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch location from LocationIQ.");
    }
  };

  // Fetch property for edit on mount
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/admin/login');
          return;
        }
        const response = await axios.get(`${url.API_URL}/admin/property/propertydetails/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const prop = response.data.property;

        const mappedProp = {
          ...prop,
          parkingAvailable: prop.parkingAvailable ? 'Yes' : 'No',
          launchDate: prop.launchDate ? moment(prop.launchDate) : null,
          completionDate: prop.completionDate ? moment(prop.completionDate) : null,
          floorPlans: Array.isArray(prop.floorPlans) ? prop.floorPlans : [],
          nearbyFacilities: Array.isArray(prop.nearbyFacilities) ? prop.nearbyFacilities : [],
          developerInfo: prop.developerInfo && typeof prop.developerInfo === 'object' ? prop.developerInfo : { developerName: '', developerDescription: '' },
        };

        form.setFieldsValue(mappedProp);

        setExistingCoverPhoto(prop.coverPhoto || null);
        if (Array.isArray(prop.images)) {
          const fullImageUrls = prop.images.map((img) => img.imageUrl);
          setExistingAdditionalPhotos(fullImageUrls);
        }
        setExistingFloorPlanPhotos(Array.isArray(prop.floorPlanPhotos) ? prop.floorPlanPhotos : []);
        setExistingDeveloperLogo(prop.developerLogo || null);
        setExistingLayoutMaps(Array.isArray(prop.layoutMaps) ? prop.layoutMaps : []);
      } catch (error) {
        toast.error('Failed to load property.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, navigate, form]);

  // Handlers for image uploads
  const handleCoverPhotoChange = ({ file }) => setCoverPhoto(file);
  const handleDeveloperLogoChange = ({ file }) => setDeveloperLogo(file);
  const handleAdditionalPhotosChange = ({ fileList }) => setNewAdditionalPhotos(fileList);
  const handleFloorPlanPhotosChange = ({ fileList }) => setNewFloorPlanPhotos(fileList);
  const handleLayoutMapsChange = ({ fileList }) => setNewLayoutMaps(fileList);

  // Handle existing image removal
  const handleRemoveExistingImage = (type, index) => {
    if (type === 'additional') {
      setExistingAdditionalPhotos(list => list.filter((_, i) => i !== index));
    } else if (type === 'floorPlan') {
      setExistingFloorPlanPhotos(list => list.filter((_, i) => i !== index));
    } else if (type === 'layoutMap') {
      setExistingLayoutMaps(list => list.filter((_, i) => i !== index));
    }
  };

  const handleRemoveSingleExistingImage = (type) => {
    if (type === 'cover') {
      setExistingCoverPhoto(null);
    } else if (type === 'logo') {
      setExistingDeveloperLogo(null);
    }
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    const formData = new FormData();

    for (const key in values) {
      if (key === 'launchDate' || key === 'completionDate') {
        formData.append(key, values[key] ? values[key].toISOString() : '');
      } else if (key === 'floorPlans' || key === 'nearbyFacilities' || key === 'developerInfo') {
        formData.append(key, JSON.stringify(values[key]));
      } else if (key === 'parkingAvailable') {
        formData.append(key, values[key] === 'Yes');
      } else {
        formData.append(key, values[key]);
      }
    }

    formData.append('existingCoverPhoto', existingCoverPhoto || '');
    formData.append('existingAdditionalPhotos', JSON.stringify(existingAdditionalPhotos));
    formData.append('existingFloorPlanPhotos', JSON.stringify(existingFloorPlanPhotos));
    formData.append('existingDeveloperLogo', existingDeveloperLogo || '');
    formData.append('existingLayoutMaps', JSON.stringify(existingLayoutMaps));

    if (coverPhoto) formData.append('coverPhoto', coverPhoto.originFileObj);
    if (developerLogo) formData.append('developerLogo', developerLogo.originFileObj);

    newAdditionalPhotos.forEach((file) => {
      formData.append('additionalPhotos', file.originFileObj);
    });
    newFloorPlanPhotos.forEach((file) => {
      formData.append('floorPlanPhotos', file.originFileObj);
    });
    newLayoutMaps.forEach((file) => {
      formData.append('layoutMaps', file.originFileObj);
    });

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${url.API_URL}/admin/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('✅ Property updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });

      setTimeout(() => navigate('/admin/properties'), 3000);
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Failed to update property. Please try again.';
      toast.error(`❌ ${errorMessage}`, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const user = JSON.parse(localStorage.getItem('user'));
  if (!localStorage.getItem('token')) {
    window.location.href = '/admin/login';
    return null;
  }

  if (loading) {
    return (
      <Spin tip="Loading..." style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }} />
    );
  }

  const uploadProps = {
    multiple: true,
    accept: 'image/*',
    listType: 'picture',
    beforeUpload: () => false,
    showUploadList: { showPreviewIcon: false },
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {user?.role === 'admin' ? <DashboardSidebar /> : <DashboardSidebar2 />}
      <Layout>
        <DashboardNavbar />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Breadcrumb style={{ marginBottom: 24 }} items={[{ title: 'Property Update' }, { title: 'Property Update' }]} />
          <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
            <UserOutlined /> Property Updation
          </Title>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Update Property</h2>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                >
                  <Card title="Basic Information" bordered={false} style={{ marginBottom: 24 }}>
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the title!' }]}>
                          <Input placeholder="Title" />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="shortDescription" label="Short Description" rules={[{ required: true, message: 'Please input a short description!' }]}>
                          <TextArea rows={2} placeholder="Short Description" />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="longDescription" label="Long Description" rules={[{ required: true, message: 'Please input a long description!' }]}>
                          <TextArea rows={4} placeholder="Long Description" />
                        </Form.Item>
                      </Col>
                      <Col lg={12} xs={24}>
                        <Form.Item name="priceRange" label="Price Range" rules={[{ required: true, message: 'Please input the price range!' }]}>
                          <Input placeholder="e.g., 50 Lacs - 1.5 Cr" />
                        </Form.Item>
                      </Col>
                      <Col lg={12} xs={24}>
                        <Form.Item name="budgetType" label="Budget Type" rules={[{ required: true, message: 'Please select a budget type!' }]}>
                          <Select placeholder="Select Budget Type">
                            <Option value="Budgeted">Budgeted</Option>
                            <Option value="Mid-Budget">Mid-Budget</Option>
                            <Option value="Premium-Budget">Premium-Budget</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  <Card title="Location Details" bordered={false} style={{ marginBottom: 24 }}>
                    {/* Google Maps Link with Fetch Button */}
                    <Form.Item 
                      name="googleMapLink" 
                      label="Google Map Link" 
                      extra="Paste a Google Maps link containing @lat,lng and click 'Fetch Location'"
                      rules={[{ required: true, message: 'Please input the Google Map link!' }]}
                    >
                      <Input
                        placeholder="https://www.google.com/maps/place/.../@12.3456,78.9012,17z"
                        suffix={
                          <Button type="primary" size="small" onClick={fetchLocationFromGoogleLink}>
                            Fetch Location
                          </Button>
                        }
                      />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item name="address" label="Full Address" rules={[{ required: true, message: 'Please input the full address!' }]}>
                          <Input placeholder="Full Address" />
                        </Form.Item>
                      </Col>
                      <Col lg={6} xs={24}>
                        <Form.Item name="city" label="City" rules={[{ required: true, message: 'Please input the city!' }]}>
                          <Input placeholder="City" />
                        </Form.Item>
                      </Col>
                      <Col lg={6} xs={24}>
                        <Form.Item name="suburb" label="Suburb" rules={[{ required: true, message: 'Please input the suburb!' }]}>
                          <Input placeholder="Suburb" />
                        </Form.Item>
                      </Col>
                      <Col lg={6} xs={24}>
                        <Form.Item name="district" label="District" rules={[{ required: true, message: 'Please input the district!' }]}>
                          <Input placeholder="District" />
                        </Form.Item>
                      </Col>
                      <Col lg={6} xs={24}>
                        <Form.Item name="state" label="State" rules={[{ required: true, message: 'Please input the state!' }]}>
                          <Input placeholder="State" />
                        </Form.Item>
                      </Col>
                      <Col lg={6} xs={24}>
                        <Form.Item name="pincode" label="Pincode" rules={[{ required: true, message: 'Please input the pincode!' }]}>
                          <Input placeholder="Pincode" />
                        </Form.Item>
                      </Col>
                      <Col lg={6} xs={24}>
                        <Form.Item name="road" label="Road" rules={[{ required: true, message: 'Please input the road!' }]}>
                          <Input placeholder="Road" />
                        </Form.Item>
                      </Col>
                      <Col lg={6} xs={24}>
                        <Form.Item name="country" label="Country" rules={[{ required: true, message: 'Please input the country!' }]}>
                          <Input placeholder="Country" />
                        </Form.Item>
                      </Col>
                      <Col lg={6} xs={24}>
                        <Form.Item name="continent" label="Continent" rules={[{ required: true, message: 'Please input the continent!' }]}>
                          <Input placeholder="Continent" />
                        </Form.Item>
                      </Col>
                      <Col lg={6} xs={24}>
                        <Form.Item name="timezone" label="Timezone">
                          <Input placeholder="Timezone" />
                        </Form.Item>
                      </Col>
                      <Col lg={6} xs={24}>
                        <Form.Item name="isoCode" label="ISO Code">
                          <Input placeholder="ISO Code" />
                        </Form.Item>
                      </Col>
                      <Col lg={6} xs={24}>
                        <Form.Item name="latitude" label="Latitude" rules={[{ required: true, message: 'Please input the latitude!' }]}>
                          <Input placeholder="Latitude" />
                        </Form.Item>
                      </Col>
                      <Col lg={6} xs={24}>
                        <Form.Item name="longitude" label="Longitude" rules={[{ required: true, message: 'Please input the longitude!' }]}>
                          <Input placeholder="Longitude" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  <Card title="Property Details" bordered={false} style={{ marginBottom: 24 }}>
                    <Row gutter={16}>
                      <Col lg={8} xs={24}>
                        <Form.Item name="propertyType" label="Property Type" rules={[{ required: true, message: 'Please select a property type!' }]}>
                          <Select placeholder="Select Property Type">
                            <Option value="Flat">Flat</Option>
                            <Option value="Apartment">Apartment</Option>
                            <Option value="Independent House">Independent House</Option>
                            <Option value="Villa">Villa</Option>
                            <Option value="Plots">Plots</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col lg={8} xs={24}>
                        <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select a status!' }]}>
                          <Select placeholder="Select Status">
                            <Option value="Launching Soon">Launching Soon</Option>
                            <Option value="Ready to Move In">Ready to Move In</Option>
                            <Option value="Under Construction">Under Construction</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col lg={8} xs={24}>
                        <Form.Item name="bedrooms" label="Bedrooms">
                          <Input placeholder="e.g., 2, 3, 4" />
                        </Form.Item>
                      </Col>
                      <Col lg={8} xs={24}>
                        <Form.Item name="bathrooms" label="Bathrooms">
                          <Input type="number" placeholder="Number of bathrooms" />
                        </Form.Item>
                      </Col>
                      <Col lg={8} xs={24}>
                        <Form.Item name="furnishedStatus" label="Furnished Status">
                          <Select placeholder="Select Furnished Status">
                            <Option value="Fully Furnished">Fully Furnished</Option>
                            <Option value="Semi-Furnished">Semi-Furnished</Option>
                            <Option value="Unfurnished">Unfurnished</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col lg={8} xs={24}>
                        <Form.Item name="parkingAvailable" label="Parking Available" rules={[{ required: true, message: 'Please select if parking is available!' }]}>
                          <Select placeholder="Parking Available">
                            <Option value="Yes">Yes</Option>
                            <Option value="No">No</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col lg={8} xs={24}>
                        <Form.Item name="launchDate" label="Launch Date" rules={[{ required: true, message: 'Please select a launch date!' }]}>
                          <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col lg={8} xs={24}>
                        <Form.Item name="completionDate" label="Completion Date" rules={[{ required: true, message: 'Please select a completion date!' }]}>
                          <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col lg={8} xs={24}>
                        <Form.Item name="floorNumber" label="Floor Number">
                          <Input placeholder="Floor Number" />
                        </Form.Item>
                      </Col>
                      <Col lg={8} xs={24}>
                        <Form.Item name="numberOfTowers" label="Number of Towers">
                          <Input placeholder="Number of Towers" />
                        </Form.Item>
                      </Col>
                      <Col lg={8} xs={24}>
                        <Form.Item name="carpetArea" label="Carpet Area">
                          <Input placeholder="Carpet Area" />
                        </Form.Item>
                      </Col>
                      <Col lg={8} xs={24}>
                        <Form.Item name="totalArea" label="Total Area" rules={[{ required: true, message: 'Please input the total area!' }]}>
                          <Input placeholder="Total Area" />
                        </Form.Item>
                      </Col>
                      <Col lg={8} xs={24}>
                        <Form.Item name="facing" label="Facing" rules={[{ required: true, message: 'Please select a facing direction!' }]}>
                          <Select placeholder="Select Facing">
                            <Option value="East Facing">East Facing</Option>
                            <Option value="West Facing">West Facing</Option>
                            <Option value="North Facing">North Facing</Option>
                            <Option value="South Facing">South Facing</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="amenities" label="Amenities" rules={[{ required: true, message: 'Please enter amenities!' }]}>
                          <TextArea rows={2} placeholder="Amenities (comma separated)" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  <Card title="Nearby Facilities (Auto-fetched from location)" bordered={false} style={{ marginBottom: 24 }}>
                    <Form.List
                      name="nearbyFacilities"
                      rules={[{
                        validator: async (_, names) => {
                          if (!names || names.length < 1) {
                            return Promise.reject(new Error('At least one nearby facility is required'));
                          }
                          return Promise.resolve();
                        }
                      }]}
                    >
                      {(fields, { add, remove }, { errors }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                              <Form.Item
                                {...restField}
                                name={[name, 'facilityType']}
                                rules={[{ required: true, message: 'Missing type' }]}
                              >
                                <Input placeholder="Type (e.g., Hospital)" />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'facilityName']}
                                rules={[{ required: true, message: 'Missing name' }]}
                              >
                                <Input placeholder="Name" />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'distance']}
                                rules={[{ required: true, message: 'Missing distance' }]}
                              >
                                <Input placeholder="Distance" />
                              </Form.Item>
                              <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                              Add Nearby Facility
                            </Button>
                          </Form.Item>
                          <Form.ErrorList errors={errors} />
                        </>
                      )}
                    </Form.List>
                  </Card>

                  <Card title="Developer Information" bordered={false} style={{ marginBottom: 24 }}>
                    <Form.Item name={['developerInfo', 'developerName']} label="Developer Name" rules={[{ required: true, message: 'Please input the developer name!' }]}>
                      <Input placeholder="Developer Name" />
                    </Form.Item>
                    <Form.Item name={['developerInfo', 'developerDescription']} label="Developer Description" rules={[{ required: true, message: 'Please input the developer description!' }]}>
                      <TextArea rows={3} placeholder="Developer Description" />
                    </Form.Item>
                  </Card>

                  <Card title="Floor Plans" bordered={false} style={{ marginBottom: 24 }}>
                    <Form.List name="floorPlans">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                              <Form.Item
                                {...restField}
                                name={[name, 'floorName']}
                              >
                                <Input placeholder="Floor Name" />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'towerName']}
                              >
                                <Input placeholder="Tower Name" />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'shortDescription']}
                              >
                                <Input placeholder="Description" />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'priceRange']}
                              >
                                <Input placeholder="Price Range" />
                              </Form.Item>
                              <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                              Add Floor Plan
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </Card>

                  <Card title="Property Images" bordered={false} style={{ marginBottom: 24 }}>
                    <Row gutter={16}>
                      <Col lg={12} xs={24}>
                        <Form.Item label="Cover Photo">
                          {existingCoverPhoto && (
                            <div style={{ marginBottom: 16, position: 'relative', width: 200 }}>
                              <Image
                                src={`https://api.promoterproperty.com/uploads/${existingCoverPhoto}`}
                                alt="Existing Cover"
                              />
                              <Button
                                type="text"
                                icon={<MinusCircleOutlined style={{ color: 'red' }} />}
                                style={{ position: 'absolute', top: 0, right: 0 }}
                                onClick={() => handleRemoveSingleExistingImage('cover')}
                              />
                            </div>
                          )}
                          <Upload {...uploadProps} onChange={handleCoverPhotoChange} fileList={coverPhoto ? [coverPhoto] : []}>
                            <Button icon={<UploadOutlined />}>Select Cover Photo</Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                      <Col lg={12} xs={24}>
                        <Form.Item label="Developer Logo">
                          {existingDeveloperLogo && (
                            <div style={{ marginBottom: 16, position: 'relative', width: 150 }}>
                              <Image
                                src={`https://api.promoterproperty.com/uploads/${existingDeveloperLogo}`}
                                alt="Existing Logo"
                              />
                              <Button
                                type="text"
                                icon={<MinusCircleOutlined style={{ color: 'red' }} />}
                                style={{ position: 'absolute', top: 0, right: 0 }}
                                onClick={() => handleRemoveSingleExistingImage('logo')}
                              />
                            </div>
                          )}
                          <Upload {...uploadProps} onChange={handleDeveloperLogoChange} fileList={developerLogo ? [developerLogo] : []}>
                            <Button icon={<UploadOutlined />}>Select Developer Logo</Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item label="Additional Photos">
                          <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {existingAdditionalPhotos.map((photo, idx) => (
                              <div key={idx} style={{ position: 'relative', width: 80, height: 60, border: '1px solid #d9d9d9', borderRadius: '2px', overflow: 'hidden' }}>
                                <Image
                                  src={`https://api.promoterproperty.com/${photo}`}
                                  alt={`addl-${idx}`}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <Button
                                  type="text"
                                  icon={<MinusCircleOutlined style={{ color: 'red' }} />}
                                  style={{ position: 'absolute', top: 0, right: 0, padding: 0, height: '20px' }}
                                  onClick={() => handleRemoveExistingImage('additional', idx)}
                                />
                              </div>
                            ))}
                          </div>
                          <Upload {...uploadProps} onChange={handleAdditionalPhotosChange} fileList={newAdditionalPhotos}>
                            <Button icon={<UploadOutlined />}>Upload New Additional Photos</Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item label="Floor Plan Photos">
                          <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {existingFloorPlanPhotos.map((photo, idx) => (
                              <div key={idx} style={{ position: 'relative', width: 80, height: 60, border: '1px solid #d9d9d9', borderRadius: '2px', overflow: 'hidden' }}>
                                <Image
                                  src={photo}
                                  alt={`floorPlan-${idx}`}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <Button
                                  type="text"
                                  icon={<MinusCircleOutlined style={{ color: 'red' }} />}
                                  style={{ position: 'absolute', top: 0, right: 0, padding: 0, height: '20px' }}
                                  onClick={() => handleRemoveExistingImage('floorPlan', idx)}
                                />
                              </div>
                            ))}
                          </div>
                          <Upload {...uploadProps} onChange={handleFloorPlanPhotosChange} fileList={newFloorPlanPhotos}>
                            <Button icon={<UploadOutlined />}>Upload New Floor Plan Photos</Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item label="Layout Maps">
                          <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {existingLayoutMaps.map((photo, idx) => (
                              <div key={idx} style={{ position: 'relative', width: 80, height: 60, border: '1px solid #d9d9d9', borderRadius: '2px', overflow: 'hidden' }}>
                                <Image
                                  src={photo}
                                  alt={`layoutMap-${idx}`}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <Button
                                  type="text"
                                  icon={<MinusCircleOutlined style={{ color: 'red' }} />}
                                  style={{ position: 'absolute', top: 0, right: 0, padding: 0, height: '20px' }}
                                  onClick={() => handleRemoveExistingImage('layoutMap', idx)}
                                />
                              </div>
                            ))}
                          </div>
                          <Upload {...uploadProps} onChange={handleLayoutMapsChange} fileList={newLayoutMaps}>
                            <Button icon={<UploadOutlined />}>Upload New Layout Maps</Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      loading={submitting}
                      disabled={submitting}
                    >
                      {submitting ? 'Updating...' : 'Update Property'}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Col>
          </Row>
          <ToastContainer />
        </Content>
      </Layout>
    </Layout>
  );
};

export default PropertyUpdation;
