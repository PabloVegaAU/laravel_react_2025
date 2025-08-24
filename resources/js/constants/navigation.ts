import { NavItem } from '@/types/core'
import { Book, ClipboardList, FileQuestion, Gift, GraduationCap, Home, Image, Package, ShoppingCart, Trophy, User, Users } from 'lucide-react'

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
    },
    {
      title: 'Avatares',
      href: '/admin/avatars',
      icon: User,
      permission: 'admin.avatars.index'
    },
    {
      title: 'Fondo',
      href: '/admin/backgrounds',
      icon: Image,
      permission: 'admin.backgrounds.index'
    },
    {
      title: 'Premios',
      href: '/admin/prizes',
      icon: Gift,
      permission: 'admin.prizes.index'
    },
    {
      title: 'Logros',
      href: '/teacher/achievements',
      icon: Trophy,
      permission: 'teacher.achievements.index'
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
      icon: ClipboardList,
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
      title: 'Sesiones de Aprendizaje',
      href: '/teacher/learning-sessions',
      icon: GraduationCap,
      permission: 'teacher.learning-sessions.index'
    },
    {
      title: 'Sesiones de Aprendizaje',
      href: '/student/learning-sessions',
      icon: GraduationCap,
      permission: 'student.learning-sessions.index'
    },
    {
      title: 'Fichas de Aplicación',
      href: '/teacher/application-forms',
      icon: ClipboardList,
      permission: 'teacher.application-forms.index'
    },
    {
      title: 'Respuestas de Fichas de Aplicación',
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
      title: 'Respuestas de Fichas de Aplicación',
      href: '/teacher/application-form-responses',
      icon: FileQuestion,
      permission: 'teacher.application-form-responses.index'
    } */
  ]

  const storeNavItems: NavItem[] = [
    {
      title: 'Tienda de Puntos',
      href: '/student/store',
      icon: ShoppingCart,
      permission: 'student.store'
    },
    {
      title: 'Objetos',
      href: '/student/objects',
      icon: Package,
      permission: 'student.objects'
    },
    {
      title: 'Premios',
      href: '/teacher/student-prizes',
      icon: Gift,
      permission: 'teacher.student-prizes.index'
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
