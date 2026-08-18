import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
const Schema=z.object({slug:z.string().min(1),title_vi:z.string().min(1),title_en:z.string().min(1),description_vi:z.string().optional(),description_en:z.string().optional(),location:z.string().optional(),year:z.coerce.number().int().optional().nullable(),equipment_vi:z.string().optional(),equipment_en:z.string().optional(),scope_vi:z.string().optional(),scope_en:z.string().optional(),cover_image_path:z.string().optional(),sort_order:z.coerce.number().int().default(0),published:z.boolean().default(true)});
export async function POST(req:Request){const s=await requireAdmin();if(!s)return NextResponse.json({error:"Supabase is not configured."},{status:503});const body=Schema.parse(await req.json());const {data,error}=await s.from("projects").insert(body).select().single();if(error)return NextResponse.json({error:error.message},{status:400});return NextResponse.json({data});}
export async function PUT(req:Request){const s=await requireAdmin();if(!s)return NextResponse.json({error:"Supabase is not configured."},{status:503});const body=Schema.extend({id:z.string().uuid()}).parse(await req.json());const {id,...values}=body;const {data,error}=await s.from("projects").update(values).eq("id",id).select().single();if(error)return NextResponse.json({error:error.message},{status:400});return NextResponse.json({data});}
export async function DELETE(req:Request){const s=await requireAdmin();if(!s)return NextResponse.json({error:"Supabase is not configured."},{status:503});const {id}=z.object({id:z.string().uuid()}).parse(await req.json());const {error}=await s.from("projects").delete().eq("id",id);if(error)return NextResponse.json({error:error.message},{status:400});return NextResponse.json({ok:true});}

export async function GET() {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ data: [] });
  const { data, error } = await s.from("projects").select("*,project_images(id,image_path,sort_order)").order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const mapped = (data ?? []).map((project: any) => ({ ...project, gallery: (project.project_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order) }));
  return NextResponse.json({ data: mapped });
}
