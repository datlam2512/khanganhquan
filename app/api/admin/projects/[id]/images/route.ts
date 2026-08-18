import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
const Schema=z.object({images:z.array(z.string()).max(12)});
export async function PUT(req:Request,{params}:{params:Promise<{id:string}>}){
 const s=await requireAdmin(); if(!s) return NextResponse.json({error:"Unauthorized"},{status:401});
 const {id}=await params; const body=Schema.parse(await req.json());
 const {error:delError}=await s.from("project_images").delete().eq("project_id",id); if(delError) return NextResponse.json({error:delError.message},{status:400});
 if(body.images.length){const rows=body.images.map((image_path,sort_order)=>({project_id:id,image_path,sort_order})); const {error}=await s.from("project_images").insert(rows); if(error)return NextResponse.json({error:error.message},{status:400});}
 return NextResponse.json({ok:true});
}
