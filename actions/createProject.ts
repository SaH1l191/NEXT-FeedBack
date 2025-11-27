'use server'
import { db } from "@/db";
import { projects } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createProject(formData: FormData) {
  const { userId } = auth();
  if (!userId) return; // or handle auth
  const project = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    url: formData.get("url") as string,
    userId,
  };

  // insert and return the new row
  try {
    //retunrns an array of object (single object)
    const res = await db.insert(projects).values(project).returning();
    console.log("createProject res:", res);
    const [newProject] = res;
    redirect(`/projects/${newProject.id}/instructions`);
    
  } catch (err) {
    console.error("createProject error:", err);
    throw err;
  }
}
