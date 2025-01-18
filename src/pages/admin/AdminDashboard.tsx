import { Navigation } from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EducationalContentManager } from "./EducationalContentManager";
import { NewsManager } from "./NewsManager";
import { UserProfilesManager } from "@/components/admin/UserProfilesManager";
import { QuizManager } from "./QuizManager";
import { PopularGuidesManager } from "@/components/admin/PopularGuidesManager";
import { PopularCoursesManager } from "@/components/admin/PopularCoursesManager";
import { FeaturedQuizzesManager } from "@/components/admin/FeaturedQuizzesManager";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="education" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="education">Educational Content</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="news">News Articles</TabsTrigger>
            <TabsTrigger value="users">User Profiles</TabsTrigger>
            <TabsTrigger value="featured">Featured Content</TabsTrigger>
          </TabsList>
          <TabsContent value="education">
            <EducationalContentManager />
          </TabsContent>
          <TabsContent value="quizzes">
            <QuizManager />
          </TabsContent>
          <TabsContent value="news">
            <NewsManager />
          </TabsContent>
          <TabsContent value="users">
            <UserProfilesManager />
          </TabsContent>
          <TabsContent value="featured" className="space-y-8">
            <PopularGuidesManager />
            <PopularCoursesManager />
            <FeaturedQuizzesManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;