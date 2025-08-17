/**
 * 数据库配置和操作
 * 这里为后续集成 SQLite 做准备
 */

import type { Course, CourseCategory } from '../types/course'

/**
 * 数据库接口
 */
export interface Database {
  // 课程相关操作
  getCourses(): Promise<Course[]>
  getCourseById(id: string): Promise<Course | null>
  createCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course>
  updateCourse(id: string, course: Partial<Course>): Promise<Course>
  deleteCourse(id: string): Promise<void>
  
  // 分类相关操作
  getCategories(): Promise<CourseCategory[]>
  createCategory(category: Omit<CourseCategory, 'id'>): Promise<CourseCategory>
  updateCategory(id: string, category: Partial<CourseCategory>): Promise<CourseCategory>
  deleteCategory(id: string): Promise<void>
  
  // 用户积分相关操作
  getUserPoints(userId: string): Promise<number>
  updateUserPoints(userId: string, points: number): Promise<void>
  
  // 课程报名相关操作
  enrollCourse(userId: string, courseId: string): Promise<void>
  getUserEnrollments(userId: string): Promise<string[]>
}

/**
 * 模拟数据库实现
 * 后续可以替换为真实的 SQLite 实现
 */
export class MockDatabase implements Database {
  private courses: Course[] = []
  private categories: CourseCategory[] = []
  private userPoints: Map<string, number> = new Map()
  private enrollments: Map<string, string[]> = new Map()

  constructor() {
    // 初始化模拟数据
    this.initializeMockData()
  }

  private initializeMockData() {
    // 这里可以加载模拟数据
    console.log('初始化模拟数据库...')
  }

  async getCourses(): Promise<Course[]> {
    return this.courses
  }

  async getCourseById(id: string): Promise<Course | null> {
    return this.courses.find(course => course.id === id) || null
  }

  async createCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    const newCourse: Course = {
      ...course,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.courses.push(newCourse)
    return newCourse
  }

  async updateCourse(id: string, course: Partial<Course>): Promise<Course> {
    const index = this.courses.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('课程不存在')
    }
    
    this.courses[index] = {
      ...this.courses[index],
      ...course,
      updatedAt: new Date().toISOString()
    }
    
    return this.courses[index]
  }

  async deleteCourse(id: string): Promise<void> {
    const index = this.courses.findIndex(c => c.id === id)
    if (index !== -1) {
      this.courses.splice(index, 1)
    }
  }

  async getCategories(): Promise<CourseCategory[]> {
    return this.categories
  }

  async createCategory(category: Omit<CourseCategory, 'id'>): Promise<CourseCategory> {
    const newCategory: CourseCategory = {
      ...category,
      id: Date.now().toString()
    }
    this.categories.push(newCategory)
    return newCategory
  }

  async updateCategory(id: string, category: Partial<CourseCategory>): Promise<CourseCategory> {
    const index = this.categories.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('分类不存在')
    }
    
    this.categories[index] = {
      ...this.categories[index],
      ...category
    }
    
    return this.categories[index]
  }

  async deleteCategory(id: string): Promise<void> {
    const index = this.categories.findIndex(c => c.id === id)
    if (index !== -1) {
      this.categories.splice(index, 1)
    }
  }

  async getUserPoints(userId: string): Promise<number> {
    return this.userPoints.get(userId) || 0
  }

  async updateUserPoints(userId: string, points: number): Promise<void> {
    this.userPoints.set(userId, points)
  }

  async enrollCourse(userId: string, courseId: string): Promise<void> {
    const userEnrollments = this.enrollments.get(userId) || []
    if (!userEnrollments.includes(courseId)) {
      userEnrollments.push(courseId)
      this.enrollments.set(userId, userEnrollments)
    }
  }

  async getUserEnrollments(userId: string): Promise<string[]> {
    return this.enrollments.get(userId) || []
  }
}

// 创建数据库实例
export const database = new MockDatabase()