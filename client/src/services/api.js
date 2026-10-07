const API_BASE_URL = 'http://localhost:5000/api';
/**
 * Custom API client for BloodConnect backend
 */
async function request(endpoint, options = {}) {
    const token = localStorage.getItem('bloodconnect_token');
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const config = {
        ...options,
        headers
    };
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'An error occurred while communicating with the server.');
        }
        return data;
    }
    catch (error) {
        console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error);
        throw error;
    }
}
export const api = {
    // Auth
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    getMe: () => request('/auth/me'),
    // Donors
    getDonors: (params = {}) => {
        const query = new URLSearchParams();
        if (params.blood_group)
            query.append('blood_group', params.blood_group);
        if (params.city)
            query.append('city', params.city);
        if (params.available !== undefined)
            query.append('available', String(params.available));
        if (params.lat !== undefined && params.lat !== null)
            query.append('lat', String(params.lat));
        if (params.lon !== undefined && params.lon !== null)
            query.append('lon', String(params.lon));
        if (params.verified !== undefined)
            query.append('verified', String(params.verified));
        if (params.search)
            query.append('search', params.search);
        return request(`/donors?${query.toString()}`);
    },
    getDonorById: (id) => request(`/donors/${id}`),
    updateDonorProfile: (id, data) => request(`/donors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    toggleDonorAvailability: (id, available) => request(`/donors/${id}/availability`, { method: 'PATCH', body: JSON.stringify({ available }) }),
    getDonationHistory: (id) => request(`/donors/${id}/donations`),
    recordDonation: (id, data) => request(`/donors/${id}/donations`, { method: 'POST', body: JSON.stringify(data) }),
    // Blood Requests
    createRequest: (requestData) => request('/requests', { method: 'POST', body: JSON.stringify(requestData) }),
    getRequests: (params = {}) => {
        const query = new URLSearchParams();
        if (params.status)
            query.append('status', params.status);
        if (params.blood_group)
            query.append('blood_group', params.blood_group);
        if (params.priority)
            query.append('priority', params.priority);
        if (params.city)
            query.append('city', params.city);
        if (params.requester_id)
            query.append('requester_id', String(params.requester_id));
        if (params.search)
            query.append('search', params.search);
        return request(`/requests?${query.toString()}`);
    },
    getRequestById: (id) => request(`/requests/${id}`),
    updateRequestStatus: (id, status) => request(`/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    deleteRequest: (id) => request(`/requests/${id}`, { method: 'DELETE' }),
    // Donor Matches
    getRequestMatches: (requestId) => request(`/requests/${requestId}/matches`),
    triggerMatching: (requestId) => request(`/requests/${requestId}/match`, { method: 'POST' }),
    contactDonorMatch: (matchId, message) => request(`/matches/${matchId}/contact`, { method: 'POST', body: JSON.stringify({ message }) }),
    updateMatchStatus: (matchId, status) => request(`/matches/${matchId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    // Admin
    getAdminStats: () => request('/admin/statistics'),
    getAdminUsers: (params = {}) => {
        const query = new URLSearchParams();
        if (params.role)
            query.append('role', params.role);
        if (params.search)
            query.append('search', params.search);
        return request(`/admin/users?${query.toString()}`);
    },
    deleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
    verifyDonor: (donorId, verified) => request(`/admin/donors/${donorId}/verify`, { method: 'PATCH', body: JSON.stringify({ verified }) }),
    getReports: () => request('/admin/reports'),
    // Hospitals
    getHospitals: (params = {}) => {
        const query = new URLSearchParams();
        if (params.city)
            query.append('city', params.city);
        if (params.search)
            query.append('search', params.search);
        return request(`/hospitals?${query.toString()}`);
    },
    getHospitalById: (id) => request(`/hospitals/${id}`),
    updateHospital: (id, data) => request(`/hospitals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    // Notifications
    getNotifications: () => request('/notifications'),
    markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PATCH' })
};
