import axios from "axios";

const BASE_URL = "https://jcgnapi.hasthiya.org/api/";
const token = localStorage.getItem("token");

export const API = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Access-Control-Allow-Origin": "*",
    Authorization: `${token}`,
    "Content-Type": "application/json",
  },
});

export const multipartAPI = axios.create({
  baseURL: BASE_URL,
  timeout: 400000,
  headers: {
    "Access-Control-Allow-Origin": "*",
    Authorization: `${token}`,
    "Content-Type": "multipart/form-data",
  },
});

const ApiConfig = axios.create({
  baseURL: BASE_URL,
});

export const getAllCareers = async () => {
  try {
    const response = await ApiConfig.get("career/getall");
    if (response.data.result.status) {
      const formattedData = response.data.result.data.map((career) => ({
        id: career.id,
        name: career.jobTitle,
        phone: formatDate(career.updatedAt),
        email: career.jobLocation,
        status: career.status,
      }));
      return formattedData;
    } else {
      console.error("Error fetching careers:", response.data.result.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching careers:", error);
    return [];
  }
};

export const getAllContacts = async () => {
  try {
    const response = await ApiConfig.get("ContactUs/getAllContactUs");

    if (response.data.status) {
      const formattedData = response.data.result.map((contact) => ({
        id: contact.id,
        fullName: contact.fullName,
        phoneNumber: contact.phoneNumber,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
        fileUrl: contact.fileUrl,
      }));

      return formattedData;
    } else {
      console.error("Error fetching contacts:", response.data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching contacts:", error.message);
    return [];
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

export const deleteContact = async (contactId) => {
  try {
    const response = await fetch(
      `${BASE_URL}ContactUs/deleteContactUsByID/${contactId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete contact");
    }
  } catch (error) {
    throw new Error(`Error deleting contact: ${error.message}`);
  }
};

export const getContact = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}ContactUs/getContactUsById/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("fail to get contact-us:", error);
    return { success: false, message: error.message };
  }
};

export const getAllNews = async () => {
  try {
    const response = await ApiConfig.get("news/getAllNews");
    if (response.data.result.status) {
      const modifiedData = response.data.result.data.map((item) => ({
        ...item,
        date: item.date.split("T")[0],
      }));
      return modifiedData;
    } else {
      console.error("Failed to fetch news:", response.data.result.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

export const deleteNewsById = async (id) => {
  try {
    const response = await ApiConfig.delete(`news/deleteNews/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting news:", error);
    return { success: false, message: "Failed to delete news." };
  }
};

export const createNews = async (formData) => {
  try {
    const response = await ApiConfig.post("news/createNews", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating news:", error);
    return { success: false, message: "Failed to add news" };
  }
};

export const getAllForms = () => {
  return ApiConfig.get("/activityForm/getAllForms");
};

export const deleteCareer = async (careerId) => {
  try {
    const response = await fetch(`${BASE_URL}career/delete/${careerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete career");
    }
  } catch (error) {
    throw new Error(`Error deleting career: ${error.message}`);
  }
};

export default ApiConfig;

export const formatDateToReadable = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

//? Audio Management
export const getAllAudio = async () => {
  try {
    const response = await API.get(`${BASE_URL}audios/`);
    if (response.data.status) {
      const formattedData = response.data.result.map((item) => ({
        ...item,
        addedDate: formatDateToReadable(item.addedDate),
      }));
      return formattedData;
    } else {
      console.error("Failed to fetch audio:", response.data.result.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

export const updateAudio = async (id, formData) => {
  try {
    const response = await multipartAPI.put(
      `${BASE_URL}audios/${id}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("fail to update audio:", error);
    return { success: false, message: error.message };
  }
};

export const deleteAudio = async (id) => {
  try {
    const response = await API.delete(`${BASE_URL}audios/${id}`);
    return response.data;
  } catch (error) {
    console.error("fail to delete audio:", error);
    return { success: false, message: error.message };
  }
};

export const getAudio = async (id) => {
  try {
    const response = await API.get(`${BASE_URL}audios/${id}`);
    return response.data;
  } catch (error) {
    console.error("fail to get audio:", error);
    return { success: false, message: error.message };
  }
};

export const createAudio = async (formData) => {
  try {
    const response = await multipartAPI.post(
      `${BASE_URL}audios/add`,
      formData,
    );
    return response.data;
  } catch (error) {
    console.error("fail to create audio:", error);
    return { success: false, message: error.message };
  }
};

//? Artists
export const getAllArtists = async () => {
  try {
    const response = await axios.get(`${BASE_URL}artists/`);
    if (response.data.status) {
      return response.data;
    } else {
      console.error("Failed to fetch artists:", response.data.result.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching artists:", error);
    return [];
  }
};

export const createArtist = async (formData) => {
  try {
    const res = await multipartAPI.post(`/artists/add`, formData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getArtistByID = async (id) => {
  try {
    const res = await API.get(`/artists/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateArtist = async (id, body) => {
  try {
    const res = await multipartAPI.put(`/artists/${id}`, body);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateArtistStatusById = async (id, body) => {
  try {
    const res = await API.put(`/artists/updateArtistStatusByID/${id}`, body);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteArtist = async (id) => {
  try {
    const res = await API.delete(`/artists/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

//? Worship service Management
export const createWorshioService = async (formData) => {
  try {
    const res = await multipartAPI.post(`/worship/createWorship`, formData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getAllWorshipService = async () => {
  try {
    const res = await API.get(`/worship/getAllWorships`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getWorshipServiceByID = async (id) => {
  try {
    const res = await API.get(`/worship/getWorshipByID/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateWorshipService = async (id, body) => {
  try {
    const res = await multipartAPI.put(
      `/worship/updateWorshipByID/${id}`,
      body
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteWorshipService = async (id) => {
  try {
    const res = await API.delete(`/worship/deleteWorshipByID/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

//? Blogs
export const createBlog = async (formData) => {
  try {
    const res = await multipartAPI.post(`/blog/createBlog`, formData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getAllBlogs = async () => {
  try {
    const res = await API.get(`/blog/getAllBlogs`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getBlogByID = async (id) => {
  try {
    const res = await API.get(`/blog/getBlogById/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateBlog = async (id, body) => {
  try {
    const res = await multipartAPI.put(`/blog/updateBlogByID/${id}`, body);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateBlogStatusById = async (id, body) => {
  try {
    const res = await API.put(`/blog/updateBlogStatusByID/${id}`, body);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBlog = async (id) => {
  try {
    const res = await API.delete(`/blog/deleteBlogByID/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

//? Video Management
export const getAllVideo = async () => {
  try {
    const response = await API.get(`${BASE_URL}videos/`);
    if (response.data.status) {
      const formattedData = response.data.result.map((item) => ({
        ...item,
        addedDate: formatDateToReadable(item.addedDate),
      }));
      return formattedData;
    } else {
      console.error("Failed to fetch video:", response.data.result.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching video:", error);
    return [];
  }
};

export const updateVideo = async (id, formData) => {
  try {
    const response = await multipartAPI.put(
      `${BASE_URL}videos/${id}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("fail to update video:", error);
    return { success: false, message: error.message };
  }
};

export const deleteVideo = async (id) => {
  try {
    const response = await API.delete(`${BASE_URL}videos/${id}`);
    return response.data;
  } catch (error) {
    console.error("fail to delete video:", error);
    return { success: false, message: error.message };
  }
};

export const getVideo = async (id) => {
  try {
    const response = await API.get(`${BASE_URL}videos/${id}`);
    return response.data;
  } catch (error) {
    console.error("fail to get video:", error);
    return { success: false, message: error.message };
  }
};

export const createVideo = async (formData) => {
  try {
    const response = await multipartAPI.post(
      `${BASE_URL}videos/place`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("fail to create audio:", error);
    return { success: false, message: error.message };
  }
};

//? Worship Centers Management
export const getAllWorshipCenters = async () => {
  try {
    const response = await API.get(
      `${BASE_URL}worshipCenter/getAllWorshipCenters`
    );
    if (response.data.status) {
      const formattedData = response.data.result.map((item) => ({
        ...item,
        createdAt: formatDateToReadable(item.createdAt),
      }));
      return formattedData;
    } else {
      console.error(
        "Failed to fetch Worship Centers:",
        response.data.result.message
      );
      return [];
    }
  } catch (error) {
    console.error("Error fetching worship centers:", error);
    return [];
  }
};

export const updateWorshipCenter = async (id, body) => {
  try {
    const response = await API.put(
      `${BASE_URL}worshipCenter/updateWorshipCenterByID/${id}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("fail to update worship centers:", error);
    return { success: false, message: error.message };
  }
};

export const deleteWorshipCenter = async (id) => {
  try {
    const response = await API.delete(
      `${BASE_URL}worshipCenter/deleteWorshipCenterByID/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("fail to delete worship centers:", error);
    return { success: false, message: error.message };
  }
};

export const getWorshipCenter = async (id) => {
  try {
    const response = await API.get(
      `${BASE_URL}worshipCenter/getWorshipCenterById/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("fail to get worship centers:", error);
    return { success: false, message: error.message };
  }
};

export const createWorshipCenter = async (body) => {
  try {
    const response = await API.post(
      `${BASE_URL}worshipCenter/createWorshipCenter`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("fail to create worship centers:", error);
    return { success: false, message: error.message };
  }
};

//? Sermons Management
export const getAllSermon = async () => {
  try {
    const response = await API.get(`${BASE_URL}sermon/getAllSermons`);
    if (response.data.status) {
      const formattedData = response.data.result.map((item) => ({
        ...item,
        addedDate: formatDateToReadable(item.addedDate),
      }));
      return formattedData;
    } else {
      console.error("Failed to fetch sermon:", response.data.result.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

export const updateSermon = async (id, formData) => {
  try {
    const response = await multipartAPI.put(
      `${BASE_URL}sermon/updateSermonById/${id}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("fail to update sermon:", error);
    return { success: false, message: error.message };
  }
};

export const deleteSermon = async (id) => {
  try {
    const response = await API.delete(
      `${BASE_URL}sermon/deleteSermonById/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("fail to delete sermon:", error);
    return { success: false, message: error.message };
  }
};

export const getSermon = async (id) => {
  try {
    const response = await API.get(`${BASE_URL}sermon/getSermonById/${id}`);
    return response.data;
  } catch (error) {
    console.error("fail to get sermon:", error);
    return { success: false, message: error.message };
  }
};

export const createSermon = async (formData) => {
  try {
    const response = await multipartAPI.post(
      `${BASE_URL}sermon/createSermon`,
      formData,
    );
    return response.data;
  } catch (error) {
    console.error("fail to create sermon:", error);
    return { success: false, message: error.message };
  }
};

//? Content Management
export const getAllContent = async () => {
  try {
    const response = await API.get(`${BASE_URL}cms/getAllCms`);
    if (response.data.status) {
      const formattedData = response.data.result.map((item) => ({
        ...item,
        createdAt: formatDateToReadable(item.createdAt),
      }));
      return formattedData;
    } else {
      console.error("Failed to fetch content:", response.data.result.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching content:", error);
    return [];
  }
};

export const updateContent = async (id, formData) => {
  try {
    const response = await multipartAPI.put(
      `${BASE_URL}cms/updateCmsByID/${id}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("fail to update content:", error);
    return { success: false, message: error.message };
  }
};

export const deleteContent = async (id) => {
  try {
    const response = await API.delete(`${BASE_URL}cms/deleteCmsByID/${id}`);
    return response.data;
  } catch (error) {
    console.error("fail to delete content:", error);
    return { success: false, message: error.message };
  }
};

export const getContent = async (id) => {
  try {
    const response = await API.get(`${BASE_URL}cms/getCmsById/${id}`);
    return response.data;
  } catch (error) {
    console.error("fail to get content:", error);
    return { success: false, message: error.message };
  }
};

export const createContent = async (formData) => {
  try {
    const response = await multipartAPI.post(
      `${BASE_URL}cms/createCms`,
      formData,
    );
    return response.data;
  } catch (error) {
    console.error("fail to create content:", error);
    return { success: false, message: error.message };
  }
};

//? Event Management
export const getAllEvent = async () => {
  try {
    const response = await API.get(
      `https://jcgnapi.hasthiya.org/event/getAllEvents`
    );
    if (response.data.status) {
      const formattedData = response.data.data.data.map((item) => ({
        ...item,
        end_date: formatDateToReadable(item.end_date),
      }));
      return formattedData;
    } else {
      console.error("Failed to fetch event:", response.data.result.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching event:", error);
    return [];
  }
};

export const updateEvent = async (id, formData) => {
  try {
    const response = await multipartAPI.put(
      `https://jcgnapi.hasthiya.org/event/updateEventByID/${id}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("fail to update event:", error);
    return { success: false, message: error.message };
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await API.delete(
      `https://jcgnapi.hasthiya.org/event/deleteEventByID/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("fail to delete event:", error);
    return { success: false, message: error.message };
  }
};

export const getEvent = async (id) => {
  try {
    const response = await API.get(
      `https://jcgnapi.hasthiya.org/event/getEventById/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("fail to get event:", error);
    return { success: false, message: error.message };
  }
};

export const createEvent = async (formData) => {
  try {
    const response = await multipartAPI.post(
      `https://jcgnapi.hasthiya.org/event/createEvent`,
      formData,
    );
    return response.data;
  } catch (error) {
    console.error("fail to create event:", error);
    return { success: false, message: error.message };
  }
};

//? Course Management
export const getAllCourse = async () => {
  try {
    const response = await API.get(
      `${BASE_URL}bible-course/getAllBibleCourses`
    );
    if (response.data.status) {
      console.log(response);
      return response.data.result;
    } else {
      console.error("Failed to fetch course:", response.data.result.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching course:", error);
    return [];
  }
};

export const updateCourse = async (id, body) => {
  try {
    const response = await API.put(
      `${BASE_URL}bible-course/updateBibleCourseByID/${id}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("fail to update course:", error);
    return { success: false, message: error.message };
  }
};

export const deleteCourse = async (id) => {
  try {
    const response = await API.delete(
      `${BASE_URL}bible-course/deleteBibleCourseByID/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("fail to delete course:", error);
    return { success: false, message: error.message };
  }
};

export const getCourse = async (id) => {
  try {
    const response = await API.get(
      `${BASE_URL}bible-course/getBibleCourseById/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("fail to get course:", error);
    return { success: false, message: error.message };
  }
};

export const createCourse = async (body) => {
  try {
    const response = await API.post(
      `${BASE_URL}bible-course/createBibleCourse`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("fail to create course:", error);
    return { success: false, message: error.message };
  }
};

//Templates
export const getAllTemplates = async () => {
  try {
    const res = await API.get(`/template/getAllTemplates`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateTemplateStatusById = async (id, body) => {
  try {
    const res = await API.put(`/template/updateTemplateByID/${id}`, body);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createTemplate = async (formData) => {
  try {
    const res = await API.post(`/template/createTemplate`, formData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getTemplateByID = async (id) => {
  try {
    const res = await API.get(`/template/getTemplateById/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateTemplate = async (id, body) => {
  try {
    const res = await API.put(`/template/updateTemplateByID/${id}`, body);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTemplates = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}template/deleteTemplateByID/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("fail to delete template:", error);
    return { success: false, message: error.message };
  }
};

// Feedbacks
export const getAllFeedbacks = async () => {
  try {
    const res = await API.get(`/feedback/getAllFeedbacks`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFeedbacks = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}feedback/deleteFeedbackByID/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("fail to delete Feedback:", error);
    return { success: false, message: error.message };
  }
};

export const createFeedback = async (formData) => {
  try {
    const res = await API.post(`/feedback/createFeedback`, formData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getFeedbackByID = async (id) => {
  try {
    const res = await API.get(`/feedback/getFeedbackById/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};


// MembershipCard 
export const getAllMembershipCards = async () => {
  try {
    const res = await API.get(`/membership/getAllMembership`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMembershipCards = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}membership/deleteMembershipByID/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("fail to delete membership card:", error);
    return { success: false, message: error.message };
  }
};



export const updateMembershipCardStatusById = async (id, body) => {
  try {
    const res = await API.put(`/membership/updateMembershipByID/${id}`, body);
    return res.data;
  } catch (error) {
    throw error;
  }
};


export const getMembershipCardByID = async (id) => {
  try {
    const res = await API.get(`/membership/getMembershipById/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createMembershipCard = async (formData) => {
  try {
    const res = await API.post(`/membership/createMembership`, formData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateMembershipCard = async (id, body) => {
  try {
    const res = await API.put(`/membership/updateMembershipByID/${id}`, body);
    return res.data;
  } catch (error) {
    throw error;
  }
};