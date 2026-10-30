import { pool, isDBConnected } from '../config/db.js';

// In-memory fallback dataset for sandbox mode if Supabase connection string is not provided yet
let mockInquiries = [
  {
    id: 'f1a9b4c2-0001-4a11-b001-000000000001',
    name: 'Aarav Sharma',
    email: 'aarav.parent@gmail.com',
    phone: '+91 98765 43210',
    user_type: 'Parent',
    category: 'Admission',
    message: 'Looking for Grade 8 admission details for academic year 2026-2027.',
    status: 'Pending',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f1a9b4c2-0002-4a11-b002-000000000002',
    name: 'Priya Patel',
    email: 'priya.student@outlook.com',
    phone: '+91 91234 56789',
    user_type: 'Student',
    category: 'Scholarship',
    message: 'Interested in applying for the National Hunar Talent Scholarship for STEM.',
    status: 'In Progress',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f1a9b4c2-0003-4a11-b003-000000000003',
    name: 'St. Xavier High School',
    email: 'principal@stxaviers.edu',
    phone: '+91 99887 76655',
    user_type: 'School',
    category: 'Concert',
    message: 'Requesting partnership for our Annual Inter-School Music and Cultural Concert.',
    status: 'Resolved',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f1a9b4c2-0004-4a11-b004-000000000004',
    name: 'Rohan Verma',
    email: 'rohan.v@yahoo.com',
    phone: '+91 94567 89012',
    user_type: 'Student',
    category: 'General Query',
    message: 'Need syllabus and past year papers for the K12 Hunar Olympiad.',
    status: 'Pending',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f1a9b4c2-0005-4a11-b005-000000000005',
    name: 'Anita Deshmukh',
    email: 'anita.d@gmail.com',
    phone: '+91 97654 32109',
    user_type: 'Parent',
    category: 'Scholarship',
    message: 'What is the eligibility criteria for the girl child merit scholarship?',
    status: 'In Progress',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Public Inquiry Submission
 * Route: POST /api/inquiries
 */
export const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, user_type, category, message } = req.body;

    if (isDBConnected()) {
      const query = `
        INSERT INTO inquiries (name, email, phone, user_type, category, message, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'Pending')
        RETURNING *;
      `;
      const values = [name, email, phone, user_type, category, message];
      const result = await pool.query(query, values);
      return res.status(201).json({
        success: true,
        message: 'Your inquiry has been submitted successfully to K12 Hunar!',
        data: result.rows[0],
      });
    } else {
      const newInquiry = {
        id: `mock-${Date.now()}`,
        name,
        email,
        phone,
        user_type,
        category,
        message,
        status: 'Pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockInquiries.unshift(newInquiry);
      return res.status(201).json({
        success: true,
        message: 'Your inquiry has been submitted successfully to K12 Hunar! (Sandbox mode)',
        data: newInquiry,
      });
    }
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit inquiry. Please try again later.',
      error: error.message,
    });
  }
};

/**
 * Get Inquiries with Filtering, Search & Pagination (Protected Admin Route)
 * Route: GET /api/inquiries
 * Query Params: search, category, userType, status, page, limit
 */
export const getInquiries = async (req, res) => {
  try {
    const {
      search = '',
      category = '',
      userType = '',
      status = '',
      page = 1,
      limit = 50,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    if (isDBConnected()) {
      const conditions = [];
      const values = [];
      let paramIndex = 1;

      // Filter by Category
      if (category && category !== 'All') {
        conditions.push(`category = $${paramIndex++}`);
        values.push(category);
      }

      // Filter by User Type
      if (userType && userType !== 'All') {
        conditions.push(`user_type = $${paramIndex++}`);
        values.push(userType);
      }

      // Filter by Status
      if (status && status !== 'All') {
        conditions.push(`status = $${paramIndex++}`);
        values.push(status);
      }

      // Search by Name or Phone Number
      if (search && search.trim() !== '') {
        const searchTerm = `%${search.trim().toLowerCase()}%`;
        conditions.push(
          `(LOWER(name) LIKE $${paramIndex} OR phone LIKE $${paramIndex} OR LOWER(email) LIKE $${paramIndex})`
        );
        values.push(searchTerm);
        paramIndex++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      // Count query
      const countQuery = `SELECT COUNT(*) FROM inquiries ${whereClause};`;
      const countResult = await pool.query(countQuery, values);
      const total = parseInt(countResult.rows[0].count, 10);

      // Data query
      const dataQuery = `
        SELECT * FROM inquiries
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex++};
      `;
      const dataValues = [...values, limitNum, offset];
      const dataResult = await pool.query(dataQuery, dataValues);

      return res.status(200).json({
        success: true,
        data: dataResult.rows,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1,
        },
      });
    } else {
      // Filter in-memory fallback
      let filtered = [...mockInquiries];

      if (category && category !== 'All') {
        filtered = filtered.filter((i) => i.category.toLowerCase() === category.toLowerCase());
      }

      if (userType && userType !== 'All') {
        filtered = filtered.filter((i) => i.user_type.toLowerCase() === userType.toLowerCase());
      }

      if (status && status !== 'All') {
        filtered = filtered.filter((i) => i.status.toLowerCase() === status.toLowerCase());
      }

      if (search && search.trim() !== '') {
        const q = search.trim().toLowerCase();
        filtered = filtered.filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            i.phone.toLowerCase().includes(q) ||
            i.email.toLowerCase().includes(q)
        );
      }

      const total = filtered.length;
      const paginatedData = filtered.slice(offset, offset + limitNum);

      return res.status(200).json({
        success: true,
        data: paginatedData,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1,
        },
      });
    }
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve inquiries.',
      error: error.message,
    });
  }
};

/**
 * Update Inquiry Status (Protected Admin Route)
 * Route: PATCH /api/inquiries/:id/status
 */
export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Closed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    if (isDBConnected()) {
      const query = `
        UPDATE inquiries
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *;
      `;
      const result = await pool.query(query, [status, id]);

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Inquiry not found.',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Inquiry status updated successfully.',
        data: result.rows[0],
      });
    } else {
      const item = mockInquiries.find((i) => i.id === id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Inquiry not found in sandbox.',
        });
      }
      item.status = status;
      item.updated_at = new Date().toISOString();
      return res.status(200).json({
        success: true,
        message: 'Inquiry status updated successfully.',
        data: item,
      });
    }
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update inquiry status.',
      error: error.message,
    });
  }
};

/**
 * Delete Inquiry (Protected Admin Route)
 * Route: DELETE /api/inquiries/:id
 */
export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDBConnected()) {
      const result = await pool.query('DELETE FROM inquiries WHERE id = $1 RETURNING id;', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Inquiry not found.',
        });
      }
    } else {
      const idx = mockInquiries.findIndex((i) => i.id === id);
      if (idx === -1) {
        return res.status(404).json({
          success: false,
          message: 'Inquiry not found in sandbox.',
        });
      }
      mockInquiries.splice(idx, 1);
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully.',
      id,
    });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete inquiry.',
    });
  }
};

/**
 * Dashboard Statistics (Protected Admin Route)
 * Route: GET /api/inquiries/stats
 */
export const getStats = async (req, res) => {
  try {
    if (isDBConnected()) {
      const totalRes = await pool.query('SELECT COUNT(*) FROM inquiries;');
      const pendingRes = await pool.query("SELECT COUNT(*) FROM inquiries WHERE status = 'Pending';");
      const inProgressRes = await pool.query("SELECT COUNT(*) FROM inquiries WHERE status = 'In Progress';");
      const resolvedRes = await pool.query("SELECT COUNT(*) FROM inquiries WHERE status = 'Resolved';");
      const todayRes = await pool.query(
        "SELECT COUNT(*) FROM inquiries WHERE created_at >= CURRENT_DATE;"
      );

      return res.status(200).json({
        success: true,
        stats: {
          total: parseInt(totalRes.rows[0].count, 10),
          pending: parseInt(pendingRes.rows[0].count, 10),
          inProgress: parseInt(inProgressRes.rows[0].count, 10),
          resolved: parseInt(resolvedRes.rows[0].count, 10),
          today: parseInt(todayRes.rows[0].count, 10),
        },
      });
    } else {
      const total = mockInquiries.length;
      const pending = mockInquiries.filter((i) => i.status === 'Pending').length;
      const inProgress = mockInquiries.filter((i) => i.status === 'In Progress').length;
      const resolved = mockInquiries.filter((i) => i.status === 'Resolved').length;

      return res.status(200).json({
        success: true,
        stats: {
          total,
          pending,
          inProgress,
          resolved,
          today: 2,
        },
      });
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics.',
    });
  }
};
