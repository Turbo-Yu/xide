import React, { useState } from 'react'
import { CourseList } from './components/CourseList'
import { mockCourses, courseCategories } from './data/mockCourses'
import type { Course } from './types/course'
import './App.css'

/**
 * 主应用组件
 * 展示课程列表页面
 */
function App() {
  const [courses, setCourses] = useState(mockCourses)
  const [userPoints, setUserPoints] = useState(2000) // 模拟用户积分

  /**
   * 处理课程报名
   */
  const handleEnroll = (courseId: string) => {
    const course = courses.find(c => c.id === courseId)
    if (course) {
      // 扣除积分
      setUserPoints(prev => prev - course.points)
      
      // 这里可以添加报名逻辑，比如调用API
      console.log(`用户报名课程: ${course.title}`)
    }
  }

  /**
   * 处理课程点赞
   */
  const handleLike = (courseId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, likes: course.likes + 1 }
        : course
    ))
  }

  return (
    <div className="App">
      <CourseList
        courses={courses}
        categories={courseCategories}
        userPoints={userPoints}
        onEnroll={handleEnroll}
        onLike={handleLike}
      />
    </div>
  )
}

export default App