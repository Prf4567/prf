import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Demo Data Structure
const SUBJECTS = {
  constitution: {
    name: 'ભારતનું બંધારણ',
    chapters: [
      { id: 'ch1', name: 'મૂળભૂત અધિકારો', totalQuestions: 15 },
      { id: 'ch2', name: 'રાજ્યની નીતિના માર્ગદર્શક તત્ત્વો', totalQuestions: 15 }
    ]
  },
  history: {
    name: 'ગુજરાતનો ઈતિહાસ',
    chapters: [
      { id: 'ch3', name: 'સોલંકી રાજવંશ', totalQuestions: 15 },
      { id: 'ch4', name: 'મુઘલ કાળ', totalQuestions: 15 }
    ]
  },
  reasoning: {
    name: 'રિઝનિંગ',
    chapters: [
      { id: 'ch5', name: 'એનાલોજી', totalQuestions: 20 },
      { id: 'ch6', name: 'કોડિંગ-ડીકોડિંગ', totalQuestions: 20 }
    ]
  }
};

// Sample student data with multiple test attempts
const DEMO_STUDENT_DATA = {
  studentId: 'STU001',
  studentName: 'રાજેશ પટેલ',
  tests: [
    {
      testId: 'TEST001',
      testName: 'મોક ટેસ્ટ 1',
      date: '2025-12-20',
      totalMarks: 100,
      obtainedMarks: 72,
      subjects: {
        constitution: {
          obtained: 22,
          total: 30,
          chapters: {
            ch1: { correct: 11, incorrect: 3, unattempted: 1, timeTaken: 450 },
            ch2: { correct: 11, incorrect: 4, unattempted: 0, timeTaken: 420 }
          }
        },
        history: {
          obtained: 23,
          total: 30,
          chapters: {
            ch3: { correct: 12, incorrect: 2, unattempted: 1, timeTaken: 380 },
            ch4: { correct: 11, incorrect: 3, unattempted: 1, timeTaken: 400 }
          }
        },
        reasoning: {
          obtained: 27,
          total: 40,
          chapters: {
            ch5: { correct: 14, incorrect: 5, unattempted: 1, timeTaken: 550 },
            ch6: { correct: 13, incorrect: 6, unattempted: 1, timeTaken: 580 }
          }
        }
      }
    },
    {
      testId: 'TEST002',
      testName: 'મોક ટેસ્ટ 2',
      date: '2025-12-21',
      totalMarks: 100,
      obtainedMarks: 78,
      subjects: {
        constitution: {
          obtained: 25,
          total: 30,
          chapters: {
            ch1: { correct: 13, incorrect: 2, unattempted: 0, timeTaken: 420 },
            ch2: { correct: 12, incorrect: 2, unattempted: 1, timeTaken: 400 }
          }
        },
        history: {
          obtained: 24,
          total: 30,
          chapters: {
            ch3: { correct: 12, incorrect: 2, unattempted: 1, timeTaken: 360 },
            ch4: { correct: 12, incorrect: 2, unattempted: 1, timeTaken: 380 }
          }
        },
        reasoning: {
          obtained: 29,
          total: 40,
          chapters: {
            ch5: { correct: 15, incorrect: 4, unattempted: 1, timeTaken: 520 },
            ch6: { correct: 14, incorrect: 5, unattempted: 1, timeTaken: 550 }
          }
        }
      }
    },
    {
      testId: 'TEST003',
      testName: 'મોક ટેસ્ટ 3',
      date: '2025-12-23',
      totalMarks: 100,
      obtainedMarks: 81,
      subjects: {
        constitution: {
          obtained: 26,
          total: 30,
          chapters: {
            ch1: { correct: 13, incorrect: 1, unattempted: 1, timeTaken: 400 },
            ch2: { correct: 13, incorrect: 2, unattempted: 0, timeTaken: 390 }
          }
        },
        history: {
          obtained: 26,
          total: 30,
          chapters: {
            ch3: { correct: 13, incorrect: 1, unattempted: 1, timeTaken: 350 },
            ch4: { correct: 13, incorrect: 2, unattempted: 0, timeTaken: 370 }
          }
        },
        reasoning: {
          obtained: 29,
          total: 40,
          chapters: {
            ch5: { correct: 15, incorrect: 4, unattempted: 1, timeTaken: 510 },
            ch6: { correct: 14, incorrect: 5, unattempted: 1, timeTaken: 540 }
          }
        }
      }
    }
  ]
};

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTest, setSelectedTest] = useState(null);
  const [studentData, setStudentData] = useState(DEMO_STUDENT_DATA);

  // Calculate 15 key parameters
  const calculateParameters = () => {
    const allTests = studentData.tests;
    const latestTest = allTests[allTests.length - 1];
    
    // 1. Overall Percentage
    const overallPercentage = (latestTest.obtainedMarks / latestTest.totalMarks * 100).toFixed(2);
    
    // 2-4. Subject-wise Performance
    const subjectPerformance = Object.keys(latestTest.subjects).map(key => ({
      subject: SUBJECTS[key].name,
      percentage: (latestTest.subjects[key].obtained / latestTest.subjects[key].total * 100).toFixed(2)
    }));
    
    // 5. Total Accuracy
    let totalCorrect = 0, totalAttempted = 0;
    Object.values(latestTest.subjects).forEach(subject => {
      Object.values(subject.chapters).forEach(chapter => {
        totalCorrect += chapter.correct;
        totalAttempted += chapter.correct + chapter.incorrect;
      });
    });
    const accuracy = (totalCorrect / totalAttempted * 100).toFixed(2);
    
    // 6. Average Time per Question
    let totalTime = 0, totalQuestions = 0;
    Object.values(latestTest.subjects).forEach(subject => {
      Object.values(subject.chapters).forEach(chapter => {
        totalTime += chapter.timeTaken;
        totalQuestions += chapter.correct + chapter.incorrect + chapter.unattempted;
      });
    });
    const avgTimePerQuestion = (totalTime / totalQuestions).toFixed(2);
    
    // 7. Improvement Rate (comparing first and last test)
    const firstTest = allTests[0];
    const improvementRate = ((latestTest.obtainedMarks - firstTest.obtainedMarks) / firstTest.obtainedMarks * 100).toFixed(2);
    
    // 8. Strongest Subject
    const strongestSubject = subjectPerformance.reduce((max, curr) => 
      parseFloat(curr.percentage) > parseFloat(max.percentage) ? curr : max
    );
    
    // 9. Weakest Subject
    const weakestSubject = subjectPerformance.reduce((min, curr) => 
      parseFloat(curr.percentage) < parseFloat(min.percentage) ? curr : min
    );
    
    // 10-15. Chapter-wise Performance
    const chapterPerformance = [];
    Object.entries(latestTest.subjects).forEach(([subKey, subject]) => {
      Object.entries(subject.chapters).forEach(([chKey, chapter]) => {
        const chapterInfo = Object.values(SUBJECTS).flatMap(s => s.chapters).find(c => c.id === chKey);
        const chapterAccuracy = (chapter.correct / (chapter.correct + chapter.incorrect) * 100).toFixed(2);
        chapterPerformance.push({
          chapter: chapterInfo.name,
          accuracy: chapterAccuracy,
          correct: chapter.correct,
          total: chapterInfo.totalQuestions
        });
      });
    });
    
    return {
      overallPercentage,
      subjectPerformance,
      accuracy,
      avgTimePerQuestion,
      improvementRate,
      strongestSubject,
      weakestSubject,
      chapterPerformance,
      totalCorrect,
      totalAttempted,
      totalUnattempted: 100 - totalAttempted
    };
  };

  const params = calculateParameters();

  // Prepare chart data
  const progressData = studentData.tests.map(test => ({
    name: test.testName,
    marks: test.obtainedMarks,
    percentage: (test.obtainedMarks / test.totalMarks * 100).toFixed(1)
  }));

  const subjectComparisonData = params.subjectPerformance.map(sp => ({
    subject: sp.subject,
    percentage: parseFloat(sp.percentage)
  }));

  const radarData = params.chapterPerformance.map(cp => ({
    chapter: cp.chapter.substring(0, 15) + '...',
    score: parseFloat(cp.accuracy)
  }));

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '"Poppins", sans-serif',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '36px', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '800'
            }}>
              વિદ્યાર્થી પર્ફોર્મન્સ ટ્રેકર
            </h1>
            <p style={{ margin: '5px 0 0', color: '#666', fontSize: '18px' }}>
              {studentData.studentName} - {studentData.studentId}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '20px 30px',
              borderRadius: '15px',
              display: 'inline-block'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>તાજેતરની પરીક્ષા</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '5px' }}>
                {params.overallPercentage}%
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px',
          marginTop: '20px'
        }}>
          <MetricCard title="કુલ ટેસ્ટ" value={studentData.tests.length} color="#FF6B6B" />
          <MetricCard title="સચોટતા" value={`${params.accuracy}%`} color="#4ECDC4" />
          <MetricCard title="સુધારો દર" value={`${params.improvementRate}%`} color="#45B7D1" />
          <MetricCard title="સરેરાશ સમય/પ્રશ્ન" value={`${params.avgTimePerQuestion}સે`} color="#FFA07A" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        {['overview', 'subjects', 'chapters', 'progress', 'detailed'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '15px 30px',
              background: activeTab === tab ? 'white' : 'rgba(255,255,255,0.2)',
              color: activeTab === tab ? '#667eea' : 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === tab ? '0 10px 30px rgba(0,0,0,0.2)' : 'none'
            }}
          >
            {tab === 'overview' && 'સારાંશ'}
            {tab === 'subjects' && 'વિષય પ્રમાણે'}
            {tab === 'chapters' && 'અધ્યાય પ્રમાણે'}
            {tab === 'progress' && 'પ્રગતિ'}
            {tab === 'detailed' && '15 પેરામીટર્સ'}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {activeTab === 'overview' && <OverviewTab data={studentData} params={params} progressData={progressData} />}
        {activeTab === 'subjects' && <SubjectsTab data={studentData} params={params} subjectData={subjectComparisonData} />}
        {activeTab === 'chapters' && <ChaptersTab data={studentData} params={params} radarData={radarData} />}
        {activeTab === 'progress' && <ProgressTab progressData={progressData} tests={studentData.tests} />}
        {activeTab === 'detailed' && <DetailedParametersTab params={params} data={studentData} />}
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, color }) => (
  <div style={{
    background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`,
    padding: '20px',
    borderRadius: '12px',
    border: `2px solid ${color}`,
    transition: 'transform 0.3s ease',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
  >
    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>{title}</div>
    <div style={{ fontSize: '28px', fontWeight: 'bold', color: color }}>{value}</div>
  </div>
);

const OverviewTab = ({ data, params, progressData }) => (
  <div>
    <h2 style={{ marginTop: 0, fontSize: '28px', color: '#333' }}>📊 સંપૂર્ણ સારાંશ</h2>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
      <div>
        <h3 style={{ color: '#667eea' }}>📈 પ્રગતિ ટ્રેન્ડ</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="marks" stroke="#667eea" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 style={{ color: '#667eea' }}>🎯 પ્રદર્શન વિતરણ</h3>
        <div style={{ marginTop: '20px' }}>
          <PerformanceBar label="સાચા જવાબો" value={params.totalCorrect} total={100} color="#4ECDC4" />
          <PerformanceBar label="ખોટા જવાબો" value={params.totalAttempted - params.totalCorrect} total={100} color="#FF6B6B" />
          <PerformanceBar label="અનુતર" value={params.totalUnattempted} total={100} color="#FFA07A" />
        </div>
      </div>
    </div>

    <div style={{ marginTop: '40px' }}>
      <h3 style={{ color: '#667eea' }}>💪 શક્તિ અને નબળાઈઓ</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #4ECDC422 0%, #4ECDC444 100%)', 
          padding: '25px', 
          borderRadius: '15px',
          border: '2px solid #4ECDC4'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#4ECDC4', marginBottom: '10px' }}>
            ✅ સૌથી મજબૂત વિષય
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
            {params.strongestSubject.subject}
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4ECDC4', marginTop: '10px' }}>
            {params.strongestSubject.percentage}%
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #FF6B6B22 0%, #FF6B6B44 100%)', 
          padding: '25px', 
          borderRadius: '15px',
          border: '2px solid #FF6B6B'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#FF6B6B', marginBottom: '10px' }}>
            ⚠️ સુધારણા જરૂરી
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
            {params.weakestSubject.subject}
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FF6B6B', marginTop: '10px' }}>
            {params.weakestSubject.percentage}%
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SubjectsTab = ({ data, params, subjectData }) => (
  <div>
    <h2 style={{ marginTop: 0, fontSize: '28px', color: '#333' }}>📚 વિષય પ્રમાણે વિશ્લેષણ</h2>
    
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={subjectData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="subject" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="percentage" fill="#667eea" radius={[10, 10, 0, 0]}>
          {subjectData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={['#FF6B6B', '#4ECDC4', '#45B7D1'][index]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>

    <div style={{ marginTop: '40px' }}>
      {params.subjectPerformance.map((subject, idx) => (
        <SubjectCard key={idx} subject={subject} color={['#FF6B6B', '#4ECDC4', '#45B7D1'][idx]} />
      ))}
    </div>
  </div>
);

const ChaptersTab = ({ data, params, radarData }) => (
  <div>
    <h2 style={{ marginTop: 0, fontSize: '28px', color: '#333' }}>📖 અધ્યાય પ્રમાણે વિશ્લેષણ</h2>
    
    <ResponsiveContainer width="100%" height={500}>
      <RadarChart data={radarData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="chapter" />
        <PolarRadiusAxis angle={90} domain={[0, 100]} />
        <Radar name="સચોટતા %" dataKey="score" stroke="#667eea" fill="#667eea" fillOpacity={0.6} />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>

    <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
      {params.chapterPerformance.map((chapter, idx) => (
        <ChapterCard key={idx} chapter={chapter} color={['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'][idx]} />
      ))}
    </div>
  </div>
);

const ProgressTab = ({ progressData, tests }) => (
  <div>
    <h2 style={{ marginTop: 0, fontSize: '28px', color: '#333' }}>📈 સમયાંતરે પ્રગતિ</h2>
    
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={progressData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="marks" stroke="#667eea" strokeWidth={4} dot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>

    <div style={{ marginTop: '40px' }}>
      <h3 style={{ color: '#667eea' }}>તમામ ટેસ્ટ્સની વિગતો</h3>
      {tests.map((test, idx) => (
        <TestCard key={idx} test={test} />
      ))}
    </div>
  </div>
);

const DetailedParametersTab = ({ params, data }) => (
  <div>
    <h2 style={{ marginTop: 0, fontSize: '28px', color: '#333' }}>🎯 15 મુખ્ય પેરામીટર્સ</h2>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
      <ParamCard num="1" title="કુલ ટકાવારી" value={`${params.overallPercentage}%`} color="#667eea" />
      <ParamCard num="2" title="સચોટતા દર" value={`${params.accuracy}%`} color="#4ECDC4" />
      <ParamCard num="3" title="સુધારો દર" value={`${params.improvementRate}%`} color="#45B7D1" />
      <ParamCard num="4" title="કુલ સાચા જવાબો" value={params.totalCorrect} color="#98D8C8" />
      <ParamCard num="5" title="કુલ ખોટા જવાબો" value={params.totalAttempted - params.totalCorrect} color="#FF6B6B" />
      <ParamCard num="6" title="અનુત્તર પ્રશ્નો" value={params.totalUnattempted} color="#FFA07A" />
      <ParamCard num="7" title="સરેરાશ સમય/પ્રશ્ન" value={`${params.avgTimePerQuestion} સેકંડ`} color="#F7DC6F" />
      <ParamCard num="8" title="કુલ ટેસ્ટ્સ" value={data.tests.length} color="#BB8FCE" />
      <ParamCard num="9" title="મજબૂત વિષય" value={params.strongestSubject.subject} color="#4ECDC4" />
      <ParamCard num="10" title="નબળો વિષય" value={params.weakestSubject.subject} color="#FF6B6B" />
      
      {params.subjectPerformance.map((subject, idx) => (
        <ParamCard 
          key={idx} 
          num={11 + idx} 
          title={subject.subject} 
          value={`${subject.percentage}%`} 
          color={['#FF6B6B', '#4ECDC4', '#45B7D1'][idx]} 
        />
      ))}
      
      <ParamCard 
        num="14" 
        title="શ્રેષ્ઠ અધ્યાય" 
        value={params.chapterPerformance.reduce((max, curr) => parseFloat(curr.accuracy) > parseFloat(max.accuracy) ? curr : max).chapter} 
        color="#4ECDC4" 
      />
      <ParamCard 
        num="15" 
        title="નબળો અધ્યાય" 
        value={params.chapterPerformance.reduce((min, curr) => parseFloat(curr.accuracy) < parseFloat(min.accuracy) ? curr : min).chapter} 
        color="#FF6B6B" 
      />
    </div>
  </div>
);

const PerformanceBar = ({ label, value, total, color }) => (
  <div style={{ marginBottom: '15px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
      <span style={{ fontWeight: '600' }}>{label}</span>
      <span style={{ fontWeight: 'bold', color }}>{value}/{total}</span>
    </div>
    <div style={{ 
      background: '#f0f0f0', 
      height: '25px', 
      borderRadius: '12px', 
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{ 
        background: color, 
        height: '100%', 
        width: `${(value/total)*100}%`,
        transition: 'width 0.5s ease',
        borderRadius: '12px'
      }} />
    </div>
  </div>
);

const SubjectCard = ({ subject, color }) => (
  <div style={{
    background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`,
    padding: '25px',
    borderRadius: '15px',
    marginBottom: '15px',
    border: `2px solid ${color}`,
    transition: 'transform 0.3s ease',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(10px)'}
  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
  >
    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
      {subject.subject}
    </div>
    <div style={{ fontSize: '36px', fontWeight: 'bold', color }}>
      {subject.percentage}%
    </div>
  </div>
);

const ChapterCard = ({ chapter, color }) => (
  <div style={{
    background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`,
    padding: '20px',
    borderRadius: '12px',
    border: `2px solid ${color}`
  }}>
    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
      {chapter.chapter}
    </div>
    <div style={{ fontSize: '28px', fontWeight: 'bold', color }}>
      {chapter.accuracy}%
    </div>
    <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
      {chapter.correct}/{chapter.total} સાચા
    </div>
  </div>
);

const TestCard = ({ test }) => (
  <div style={{
    background: 'linear-gradient(135deg, #667eea22 0%, #764ba244 100%)',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '15px',
    border: '2px solid #667eea'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{test.testName}</div>
        <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>{test.date}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>
          {test.obtainedMarks}/{test.totalMarks}
        </div>
        <div style={{ fontSize: '16px', color: '#666' }}>
          {(test.obtainedMarks / test.totalMarks * 100).toFixed(2)}%
        </div>
      </div>
    </div>
  </div>
);

const ParamCard = ({ num, title, value, color }) => (
  <div style={{
    background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`,
    padding: '20px',
    borderRadius: '12px',
    border: `2px solid ${color}`,
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: color,
      color: 'white',
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '14px'
    }}>
      {num}
    </div>
    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>{title}</div>
    <div style={{ fontSize: '24px', fontWeight: 'bold', color }}>{value}</div>
  </div>
);

export default StudentDashboard;
