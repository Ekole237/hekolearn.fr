'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/lib/auth/hooks';
import { CourseCard } from "@/components/courses/course-card";
import { CourseFilters } from "@/components/courses/course-filters";
import { CoursePagination } from "@/components/courses/course-pagination";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentCourses } from "@/components/dashboard/recent-courses";
import { RecommendedCourses } from "@/components/dashboard/recommended-courses";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCourses, getRecentCourses, getRecommendedCourses, type Course } from '@/lib/courses/service';

export default function CoursesPage() {
  const { user } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadData() {
      try {
        const [coursesData, recentData, recommendedData] = await Promise.all([
          getCourses(),
          user ? getRecentCourses(user.id) : [],
          user ? getRecommendedCourses(user.id) : []
        ]);

        setCourses(coursesData);
        setRecentCourses(recentData);
        setRecommendedCourses(recommendedData);

        // Créer un Set des IDs des cours auxquels l'utilisateur est inscrit
        const enrolledIds = new Set(recentData.map((enrollment: any) => enrollment.course_id));
        setEnrolledCourseIds(enrolledIds);
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  // État pour la pagination et les filtres
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    subject: '',
    level: '',
    search: '',
  });

  // Filtrer et paginer les cours
  const filteredCourses = courses.filter(course => {
    const matchesSubject = !filters.subject || course.category_id === filters.subject;
    const matchesLevel = !filters.level || course.difficulty === filters.level;
    const matchesSearch = !filters.search || 
      course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.description.toLowerCase().includes(filters.search.toLowerCase());
    return matchesSubject && matchesLevel && matchesSearch;
  });

  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Tabs defaultValue="all-courses">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="all-courses">Tous les cours</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <StatsCards />
          <div className="grid gap-6 md:grid-cols-2">
            <RecentCourses courses={recentCourses} />
            <RecommendedCourses courses={recommendedCourses} />
          </div>
        </TabsContent>

        <TabsContent value="all-courses">
          <CourseFilters
            filters={filters}
            onFilterChange={setFilters}
          />

          {loading ? (
            <div className="text-center py-8">Chargement des cours...</div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {paginatedCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    id={course.id}
                    href={`/courses/${course.slug}`}
                    title={course.title}
                    description={course.description}
                    imageUrl={course.image_url}
                    duration={course.duration}
                    level={course.difficulty}
                    enrolled={enrolledCourseIds.has(course.id)}
                  />
                ))}
              </div>

              {paginatedCourses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun cours ne correspond à vos critères de recherche.
                </div>
              )}

              {totalPages > 1 && (
                <CoursePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
