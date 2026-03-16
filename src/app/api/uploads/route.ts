import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCurrentOrganization } from "@/lib/auth/get-organization"
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "@/features/attachments/schemas"
import { logActivity } from "@/features/activity/actions"

export async function POST(req: NextRequest) {
  try {
    const { organization, user } = await getCurrentOrganization()
    const formData = await req.formData()
    
    const file = formData.get("file") as File
    const taskId = formData.get("taskId") as string
    const projectId = formData.get("projectId") as string

    if (!file || !taskId || !projectId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate file
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "File type not supported" }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds limit (10MB)" }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Upload to Storage
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_")
    const filePath = `org_${organization.id}/project_${projectId}/task_${taskId}/${timestamp}_${safeName}`

    const { data: storageData, error: storageError } = await supabase.storage
      .from("task-attachments")
      .upload(filePath, file)

    if (storageError) throw new Error(storageError.message)

    // Get public URL or just save path
    // We'll use the path and fetch signed URLs or similar if needed, 
    // but for MVP we'll just save the path.
    
    const { error: dbError } = await (supabase.from("task_attachments") as any)
      .insert({
        task_id: taskId,
        uploaded_by: user.id,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
      })

    if (dbError) throw new Error(dbError.message)

    // Log Activity
    await logActivity({
      organizationId: organization.id,
      actorId: user.id,
      entityType: "task",
      entityId: taskId,
      action: "upload_attachment",
      metadata: { file_name: file.name },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 })
  }
}
