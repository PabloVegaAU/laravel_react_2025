import { NavItem } from '@/types/core'
import { Book, FileQuestion, GraduationCap, Home, Users } from 'lucide-react'

// Función para verificar permisos
const hasPermission = (permissions: string[] = [], requiredPermission: string): boolean => {
  return permissions.some(
    (permission) => permission === requiredPermission || permission === 'admin.*' || permission === `${requiredPermission.split('.')[0]}.*`
  )
}

// Función para crear items de navegación con verificación de permisos
export const createNavItems = (permissions: string[] = []) => {
  const noTitleNavItems: NavItem[] = [
    {
      title: 'Inicio',
      href: '/admin',
      icon: Home,
      permission: 'admin.dashboard'
    },
    {
      title: 'Inicio',
      href: '/teacher',
      icon: Home,
      permission: 'teacher.dashboard'
    },
    {
      title: 'Inicio',
      href: '/student',
      icon: Home,
      permission: 'student.dashboard'
    }
  ]

  const peopleNavItems: NavItem[] = [
    {
      title: 'Docentes',
      href: '/admin/teachers',
      icon: Users,
      permission: 'admin.teachers.index'
    },
    {
      title: 'Alumnos',
      href: '/admin/students',
      icon: Users,
      permission: 'admin.students.index'
    },
    {
      title: 'Matriculas',
      href: '/admin/enrollments',
      icon: Users,
      permission: 'admin.enrollments.index'
    }
  ]

  const schoolNavItems: NavItem[] = [
    {
      title: 'Grados',
      href: '/admin/grados',
      icon: GraduationCap,
      permission: 'admin.grados.index'
    },
    {
      title: 'Secciones',
      href: '/admin/secciones',
      icon: GraduationCap,
      permission: 'admin.secciones.index'
    },
    {
      title: 'Materias',
      href: '/admin/materias',
      icon: Book,
      permission: 'admin.materias.index'
    }
  ]

  const applicationFormsNavItems: NavItem[] = [
    {
      title: 'Gestión de Logros',
      href: '/teacher/achievements',
      icon: FileQuestion,
      permission: 'teacher.achievements.index'
    },
    {
      title: 'Sesiones de aprendizaje',
      href: '/teacher/learning-sessions',
      icon: FileQuestion,
      permission: 'teacher.learning-sessions.index'
    },
    {
      title: 'Sesiones de aprendizaje',
      href: '/student/learning-sessions',
      icon: FileQuestion,
      permission: 'student.learning-sessions.index'
    },
    {
      title: 'Fichas de Aplicación',
      href: '/teacher/application-forms',
      icon: FileQuestion,
      permission: 'teacher.application-forms.index'
    },
    {
      title: 'Respuestas de fichas de aplicación',
      href: '/student/application-form-responses',
      icon: FileQuestion,
      permission: 'student.application-form-responses.index'
    },
    {
      title: 'Preguntas',
      href: '/teacher/questions',
      icon: FileQuestion,
      permission: 'teacher.questions.index'
    }
    /* {
      title: 'Respuestas de fichas de aplicación',
      href: '/teacher/application-form-responses',
      icon: FileQuestion,
      permission: 'teacher.application-form-responses.index'
    } */
  ]

  const storeNavItems: NavItem[] = [
    {
      title: 'Tienda de Puntos',
      href: '/student/store',
      icon: FileQuestion,
      permission: 'student.store'
    },
    {
      title: 'Objetos',
      href: '/student/objects',
      icon: FileQuestion,
      permission: 'student.objects'
    }
  ]

  // Filtrar items basados en permisos
  const filterByPermission = (items: NavItem[]): NavItem[] => {
    return items.filter((item) => !item.permission || hasPermission(permissions, item.permission))
  }

  return {
    noTitleNavItems: filterByPermission(noTitleNavItems),
    peopleNavItems: filterByPermission(peopleNavItems),
    schoolNavItems: filterByPermission(schoolNavItems),
    applicationFormsNavItems: filterByPermission(applicationFormsNavItems),
    storeNavItems: filterByPermission(storeNavItems)
  }
}
