import { getAllPosts } from "@/lib/queries";
import { PostForm } from "@/components/admin/post-form";
import { PostsList } from "@/components/admin/posts-list";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminBlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Blog</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý bài viết và trạng thái công khai.
          </p>
        </div>
        <PostForm />
      </div>

      <Card>
        <CardContent>
          <PostsList posts={posts} />
        </CardContent>
      </Card>
    </div>
  );
}
