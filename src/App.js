import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [userRole, setUserRole] = useState('student');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comments: '', teachingQuality: 5, courseContent: 5, difficulty: 3 });

  useEffect(() => {
    if (currentView === 'admin') {
      fetch('/api/analytics')
        .then(res => res.json())
        .then(data => setAnalyticsData(data))
        .catch(err => console.error(err));
    }
    if (currentView === 'student') {
      // Mock courses data
      setCourses([
        { id: 1, name: 'Mathematics 101', instructor: 'Dr. Smith', rating: 4.2, status: 'pending' },
        { id: 2, name: 'Physics 201', instructor: 'Dr. Johnson', rating: 4.5, status: 'completed' },
        { id: 3, name: 'Chemistry 101', instructor: 'Dr. Williams', rating: null, status: 'pending' },
        { id: 4, name: 'Computer Science 301', instructor: 'Dr. Brown', rating: 4.8, status: 'completed' },
      ]);
    }
  }, [currentView]);

  const handleLogin = (role) => {
    setUserRole(role);
    setCurrentView(role === 'admin' ? 'admin' : 'student');
  };

  const handleLogout = () => {
    setCurrentView('login');
    setUserRole('student');
  };

    const handleFeedbackClick = (course) => {
    setSelectedCourse(course);
    if (course.status === 'completed') {
      // Show existing feedback
      setFeedbackForm({ rating: course.rating, comments: 'Previously submitted feedback', teachingQuality: course.rating, courseContent: course.rating, difficulty: 3 });
    } else {
      // Reset form for new feedback
      setFeedbackForm({ rating: 5, comments: '', teachingQuality: 5, courseContent: 5, difficulty: 3 });
    }
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = () => {
    // Update course status
    const updatedCourses = courses.map(c => 
      c.id === selectedCourse.id ? { ...c, status: 'completed', rating: feedbackForm.rating } : c
    );
    setCourses(updatedCourses);
    setShowFeedbackModal(false);
    alert(`Feedback submitted for ${selectedCourse.name}!`);
  };

  if (currentView === 'login') {
    return <LoginPage onLogin={handleLogin} userRole={userRole} setUserRole={setUserRole} />;
  }

  if (currentView === 'admin') {
    return <AdminDashboard analyticsData={analyticsData} onLogout={handleLogout} />;
  }

  return (
    <>
      <StudentDashboard 
        courses={courses} 
        onLogout={handleLogout} 
        onFeedbackClick={handleFeedbackClick}
      />
      {showFeedbackModal && (
        <FeedbackModal 
          course={selectedCourse}
          feedbackForm={feedbackForm}
          setFeedbackForm={setFeedbackForm}
          onSubmit={handleFeedbackSubmit}
          onClose={() => setShowFeedbackModal(false)}
        />
      )}
    </>
  );}

// Login Page Component
function LoginPage({ onLogin, userRole, setUserRole }) {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Evaluation System</h1>
        <div className="role-selector">
          <button 
            className={userRole === 'student' ? 'active' : ''}
            onClick={() => setUserRole('student')}
          >
            Student
          </button>
          <button 
            className={userRole === 'admin' ? 'active' : ''}
            onClick={() => setUserRole('admin')}
          >
            Admin
          </button>
        </div>
        <div className="login-form">
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button className="login-btn" onClick={() => onLogin(userRole)}>
            Login
          </button>
        </div>
        <div className="demo-credentials">
          <p><strong>Demo Credentials:</strong></p>
          <p>Student: student / password</p>
          <p>Admin: admin / password</p>
        </div>
      </div>
    </div>
  );
}

// Student Dashboard Component
function StudentDashboard({ courses, onLogout, onFeedbackClick }) {  const pendingCount = courses.filter(c => c.status === 'pending').length;
  const completedCount = courses.filter(c => c.status === 'completed').length;
  const avgRating = courses.filter(c => c.rating).reduce((a, b) => a + b.rating, 0) / courses.filter(c => c.rating).length;

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>Evaluation System</h2>
        <div className="nav-right">
          <span>👤 Student</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </nav>
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome Back, Student!</h1>
          <p>Track your course feedback and evaluations</p>
        </div>
        <div className="stats-cards">
          <div className="stat-card">
            <h3>{pendingCount}</h3>
            <p>Pending Feedback</p>
          </div>
          <div className="stat-card">
            <h3>{completedCount}</h3>
            <p>Completed Courses</p>
          </div>
          <div className="stat-card">
            <h3>{avgRating.toFixed(1)}</h3>
            <p>Average Rating</p>
          </div>
        </div>
        <div className="courses-section">
          <h2>My Courses</h2>
          <div className="courses-list">
            {courses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-header">
                  <h3>{course.name}</h3>
                  <span className={`status-badge ${course.status}`}>
                    {course.status === 'pending' ? 'Feedback Due' : 'Feedback Done'}
                  </span>
                </div>
                <p className="instructor">Instructor: {course.instructor}</p>
                <div className="course-footer">
                  {course.rating ? (
                    <div className="rating">
                      <span>⭐ {course.rating}</span>
                    </div>
                  ) : (
                    <span className="no-rating">Not rated yet</span>
                  )}
                <button className="btn-feedback" onClick={() => onFeedbackClick(course)}>                    {course.status === 'pending' ? 'Give Feedback' : 'View Feedback'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin Dashboard Component
function AdminDashboard({ analyticsData, onLogout }) {
  const courseRatings = [
    { name: 'Math 101', rating: 4.2 },
    { name: 'Physics 201', rating: 4.5 },
    { name: 'Chemistry 101', rating: 3.8 },
    { name: 'CS 301', rating: 4.8 },
    { name: 'Biology 101', rating: 4.0 },
  ];

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>Evaluation System</h2>
        <div className="nav-right">
          <span>👤 Administrator</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </nav>
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Admin Dashboard</h1>
          <p>Monitor and analyze course evaluations</p>
        </div>
        <div className="stats-cards">
          <div className="stat-card">
            <h3>{analyticsData?.averageRating || '4.3'}</h3>
            <p>Average Rating</p>
          </div>
          <div className="stat-card">
            <h3>{analyticsData?.totalResponses || '231'}</h3>
            <p>Total Responses</p>
          </div>
          <div className="stat-card">
            <h3>{analyticsData?.activeForms || '8'}</h3>
            <p>Active Forms</p>
          </div>
          <div className="stat-card">
            <h3>{analyticsData?.responseRate || '70%'}</h3>
            <p>Response Rate</p>
          </div>
        </div>
        <div className="charts-section">
          <div className="chart-card">
            <h2>Course Ratings</h2>
            <div className="bar-chart">
              {courseRatings.map((course, index) => (
                <div key={index} className="bar-item">
                  <div className="bar-label">{course.name}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${(course.rating / 5) * 100}%` }}
                    ></div>
                    <span className="bar-value">{course.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-card">
            <h2>Rating Trends</h2>
            <div className="line-chart">
              <p>📈 Showing positive trend in recent evaluations</p>
              <div className="trend-indicators">
                <div className="trend-item">
                  <span className="trend-label">This Month</span>
                  <span className="trend-value up">+12%</span>
                </div>
                <div className="trend-item">
                  <span className="trend-label">Last Month</span>
                  <span className="trend-value up">+8%</span>
                </div>
                <div className="trend-item">
                  <span className="trend-label">3 Months Ago</span>
                  <span className="trend-value">+5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

  // Feedback Modal Component
function FeedbackModal({ course, feedbackForm, setFeedbackForm, onSubmit, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Feedback for {course.name}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Overall Rating: {feedbackForm.rating}/5</label>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={feedbackForm.rating} 
              onChange={(e) => setFeedbackForm({...feedbackForm, rating: parseFloat(e.target.value)})}
            />
          </div>
          <div className="form-group">
            <label>Teaching Quality: {feedbackForm.teachingQuality}/5</label>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={feedbackForm.teachingQuality} 
              onChange={(e) => setFeedbackForm({...feedbackForm, teachingQuality: parseFloat(e.target.value)})}
            />
          </div>
          <div className="form-group">
            <label>Course Content: {feedbackForm.courseContent}/5</label>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={feedbackForm.courseContent} 
              onChange={(e) => setFeedbackForm({...feedbackForm, courseContent: parseFloat(e.target.value)})}
            />
          </div>
          <div className="form-group">
            <label>Comments:</label>
            <textarea 
              value={feedbackForm.comments} 
              onChange={(e) => setFeedbackForm({...feedbackForm, comments: e.target.value})}
              placeholder="Share your feedback about the course..."
              rows="4"
            />
          </div>
        </div>
        <div className="modal-footer">
          {course.status === 'pending' && (
            <button className="submit-btn" onClick={onSubmit}>Submit Feedback</button>
          )}
          <button className="cancel-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default App;

