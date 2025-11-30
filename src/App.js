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
    return <AdminDashboard analyticsData={analyticsData} courses={courses} onLogout={handleLogo onNavigate={setCurrentView}ut} />;
  }
  
  if (currentView === 'settings') {
    return <SettingsPage userRole={userRole} onLogout={handleLogout} onBack={() => setCurrentView(userRole === 'admin' ? 'admin' : 'student')} />;
  }

  if (currentView === 'help') {
    return <HelpPage onLogout={handleLogout} onBack={() => setCurrentView(userRole === 'admin' ? 'admin' : 'student')} />;
  }

  if (currentView === 'reports') {
    return <ReportsPage courses={courses} onLogout={handleLogout} onBack={() => setCurrentView('admin')} />;
  }


  return (
    <>
      <StudentDashboard 
        courses={courses} 
        onLogout={handleLogout} 
        onFeedbackClick={handleFeedbackClick}
                      onNavigate={setCurrentView}
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
         <div className="feedback-carousel">
       <h2 className="feedback-title">Student Feedback</h2>
       <div className="feedback-scroll">
         <div className="feedback-item">⭐ "Great course! Learned so much." - Sarah</div>
         <div className="feedback-item">⭐ "Instructor was very helpful and engaging!" - John</div>
         <div className="feedback-item">⭐ "Excellent material and well structured." - Emma</div>
         <div className="feedback-item">⭐ "Highly recommended for beginners." - Mike</div>
         <div className="feedback-item">⭐ "Best course I've taken!" - Lisa</div>
       </div>
     </div>
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
function StudentDashboard({ courses, onLogout, onFeedbackClick }) {  const pendingCount = courses.filter(c => c.status === 'pending').length;, onNavigate
  const completedCount = courses.filter(c => c.status === 'completed').length;
  const avgRating = courses.filter(c => c.rating).reduce((a, b) => a + b.rating, 0) / courses.filter(c => c.rating).length;

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>Evaluation System</h2>
        <div className="nav-right">
          <span>👤 Student</span>
          <button onClick={onLogout}>Logout</button>
              <button onClick={() => onNavigate('settings')}>⚙️ Settings</button>
          <button onClick={() => onNavigate('help')}>❓ Help</button>
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
function AdminDashboard({ analyticsData,  courses,onLogout }) {
const courseRatings = courses.map(course => ({
    name: course.name,
    rating: course.rating || 0
  }));, onNavigate
  const avgRating = courses.filter(c => c.rating).reduce((sum, c) => sum + c.rating, 0) / (courses.filter(c => c.rating).length || 1);
  
  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>Evaluation System</h2>
        <div className="nav-right">
          <span>👤 Administrator</span>
          <button onClick={onLogout}>Logout</button>
              <button onClick={() => onNavigate('reports')}>📈 Reports</button>
          <button onClick={() => onNavigate('settings')}>⚙️ Settings</button>
          <button onClick={() => onNavigate('help')}>❓ Help</button>
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

// Settings Page Component
function SettingsPage({ userRole, onLogout, onBack }) {
  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>Evaluation System</h2>
        <div className="nav-right">
          <span>👤 {userRole === 'admin' ? 'Administrator' : 'Student'}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </nav>
      <div className="dashboard-content">
        <div className="welcome-section">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <h1>Settings</h1>
          <p>Manage your profile and preferences</p>
        </div>
        <div className="settings-container">
          <div className="settings-card">
            <h3>Profile Settings</h3>
            <div className="settings-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your name" />
            </div>
            <div className="settings-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" />
            </div>
            <div className="settings-group">
              <label>Role</label>
              <input type="text" value={userRole} disabled />
            </div>
            <button className="btn-save">Save Changes</button>
          </div>
          <div className="settings-card">
            <h3>Preferences</h3>
            <div className="settings-group">
              <label>
                <input type="checkbox" defaultChecked /> Email Notifications
              </label>
            </div>
            <div className="settings-group">
              <label>
                <input type="checkbox" defaultChecked /> Feedback Reminders
              </label>
            </div>
            <div className="settings-group">
              <label>
                <input type="checkbox" /> Marketing Emails
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Help/About Page Component
function HelpPage({ onLogout, onBack }) {
  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>Evaluation System</h2>
        <div className="nav-right">
          <button onClick={onLogout}>Logout</button>
        </div>
      </nav>
      <div className="dashboard-content">
        <div className="welcome-section">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <h1>Help & About</h1>
          <p>Learn how to use the Evaluation System</p>
        </div>
        <div className="help-container">
          <div className="help-card">
            <h3>📚 Getting Started</h3>
            <p>Welcome to the Evaluation System. This platform allows students to provide feedback on their courses and helps administrators monitor course quality.</p>
          </div>
          <div className="help-card">
            <h3>🎯 For Students</h3>
            <ul>
              <li>View all your enrolled courses</li>
              <li>Submit feedback for pending courses</li>
              <li>Track your course progress</li>
              <li>View previously submitted feedback</li>
            </ul>
          </div>
          <div className="help-card">
            <h3>📊 For Administrators</h3>
            <ul>
              <li>Monitor course ratings and feedback</li>
              <li>View detailed analytics and trends</li>
              <li>Track response rates</li>
              <li>Generate reports</li>
            </ul>
          </div>
          <div className="help-card">
            <h3>❓ FAQ</h3>
            <p><strong>Q: Can I edit my feedback after submission?</strong></p>
            <p>A: Once submitted, feedback cannot be edited. Please review before submitting.</p>
            <p><strong>Q: Is my feedback anonymous?</strong></p>
            <p>A: Feedback is associated with your account for tracking purposes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reports Page Component (Admin only)
function ReportsPage({ courses, onLogout, onBack }) {
  const totalCourses = courses.length;
  const completedFeedback = courses.filter(c => c.status === 'completed').length;
  const completionRate = ((completedFeedback / totalCourses) * 100).toFixed(1);

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
          <button className="back-btn" onClick={onBack}>← Back</button>
          <h1>Reports & Analytics</h1>
          <p>Detailed analysis of course evaluations</p>
        </div>
        <div className="reports-container">
          <div className="report-card">
            <h3>📈 Feedback Completion</h3>
            <div className="stat-large">{completionRate}%</div>
            <p>{completedFeedback} of {totalCourses} courses have feedback</p>
          </div>
          <div className="report-card">
            <h3>⭐ Highest Rated Course</h3>
            <div className="stat-large">{Math.max(...courses.filter(c => c.rating).map(c => c.rating)).toFixed(1)}</div>
            <p>{courses.find(c => c.rating === Math.max(...courses.filter(c => c.rating).map(c => c.rating)))?.name}</p>
          </div>
          <div className="report-card">
            <h3>📊 Average Ratings by Category</h3>
            <div className="rating-summary">
              <p>Overall: 4.3/5</p>
              <p>Teaching Quality: 4.2/5</p>
              <p>Course Content: 4.4/5</p>
            </div>
          </div>
        </div>
        <div className="export-section">
          <h3>Export Options</h3>
          <button className="btn-export">📥 Export as PDF</button>
          <button className="btn-export">📥 Export as CSV</button>
        </div>
      </div>
    </div>
  );
}



export default App;

