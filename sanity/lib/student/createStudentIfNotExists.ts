import groq from "groq";
import { client } from "../adminClient";
import { sanityFetch } from "../live";

interface CreateStudentProps {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

export async function createStudentIfNotExists({
  clerkId,
  email,
  firstName,
  lastName,
  imageUrl,
}: CreateStudentProps) {
  console.log("createStudentIfNotExists called with:", { clerkId, email, firstName, lastName });
  
  // First check if student exists
  const existingStudent = await sanityFetch({
    query: groq`*[_type == "student" && clerkId == $clerkId][0]`,
    params: { clerkId },
  });

  console.log("Existing student query result:", existingStudent);

  // Extract the actual student data
  const studentData = existingStudent?.data || existingStudent;
  console.log("Extracted student data:", studentData);

  if (studentData && studentData._id) {
    console.log("Student already exists", studentData);
    return studentData;
  }

  // If no student exists, create a new one
  console.log("Creating new student with data:", { clerkId, email, firstName, lastName, imageUrl });
  
  try {
    const newStudent = await client.create({
      _type: "student",
      clerkId,
      email,
      name: `${firstName || ""} ${lastName || ""}`.trim() || email,
      imageUrl,
    });

    console.log("New student created", newStudent);
    return newStudent;
  } catch (error) {
    console.error("Error creating student:", error);
    throw new Error("Failed to create student");
  }
}
