"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";

import { getSupabaseBrowserUrl } from "@/lib/utils";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProjectGalleryItem = {
  id: string;
  image_path: string;
  sort_order: number;
};

type Project = {
  id: string;
  slug: string;
  title_vi: string;
  title_en: string;
  description_vi: string;
  description_en: string;
  location: string;
  year: number | null;
  equipment_vi: string;
  equipment_en: string;
  scope_vi: string;
  scope_en: string;
  cover_image_path: string;
  published: boolean;
  gallery: ProjectGalleryItem[];
};

type ProjectForm = Omit<Project, "id" | "gallery">;

function createEmptyForm(): ProjectForm {
  return {
    slug: "",
    title_vi: "",
    title_en: "",
    description_vi: "",
    description_en: "",
    location: "",
    year: new Date().getFullYear(),
    equipment_vi: "",
    equipment_en: "",
    scope_vi: "",
    scope_en: "",
    cover_image_path: "",
    published: true,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isProject(value: unknown): value is Project {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.slug === "string"
  );
}

export default function Projects() {
  const [items, setItems] = useState<Project[]>([]);
  const [form, setForm] = useState<ProjectForm>(createEmptyForm);
  const [editing, setEditing] = useState<string>("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [msg, setMsg] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load(): Promise<void> {
    try {
      const response = await fetch("/api/admin/projects", {
        cache: "no-store",
      });

      const json: unknown = await response.json();

      if (!response.ok) {
        const message =
          isRecord(json) && typeof json.error === "string"
            ? json.error
            : "Không thể tải danh sách dự án.";

        throw new Error(message);
      }

      if (!isRecord(json) || !Array.isArray(json.data)) {
        throw new Error("Dữ liệu dự án không hợp lệ.");
      }

      setItems(json.data as Project[]);
    } catch (error: unknown) {
      console.error("Load projects error:", error);

      setMsg(
        error instanceof Error
          ? error.message
          : "Không thể tải danh sách dự án.",
      );
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function initialize(): Promise<void> {
      try {
        const response = await fetch("/api/admin/projects", {
          cache: "no-store",
        });

        const json: unknown = await response.json();

        if (!response.ok) {
          const message =
            isRecord(json) && typeof json.error === "string"
              ? json.error
              : "Không thể tải danh sách dự án.";

          throw new Error(message);
        }

        if (!isRecord(json) || !Array.isArray(json.data)) {
          throw new Error("Dữ liệu dự án không hợp lệ.");
        }

        if (!cancelled) {
          setItems(json.data as Project[]);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          console.error("Load projects error:", error);

          setMsg(
            error instanceof Error
              ? error.message
              : "Không thể tải danh sách dự án.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  function edit(project: Project): void {
    setEditing(project.id);

    setForm({
      slug: project.slug ?? "",
      title_vi: project.title_vi ?? "",
      title_en: project.title_en ?? "",
      description_vi: project.description_vi ?? "",
      description_en: project.description_en ?? "",
      location: project.location ?? "",
      year: project.year ?? null,
      equipment_vi: project.equipment_vi ?? "",
      equipment_en: project.equipment_en ?? "",
      scope_vi: project.scope_vi ?? "",
      scope_en: project.scope_en ?? "",
      cover_image_path: project.cover_image_path ?? "",
      published: Boolean(project.published),
    });

    setGallery(
      [...(project.gallery ?? [])]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((image) => image.image_path)
        .filter(Boolean),
    );

    setMsg("");
  }

  function reset(): void {
    setEditing("");
    setForm(createEmptyForm());
    setGallery([]);
    setMsg("");
  }

  async function save(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!form.title_vi.trim()) {
      setMsg("Vui lòng nhập tên dự án tiếng Việt.");
      return;
    }

    if (!form.slug.trim()) {
      setMsg("Vui lòng nhập slug.");
      return;
    }

    setSaving(true);
    setMsg("");

    try {
      const payload: ProjectForm & { id?: string } = editing
        ? { ...form, id: editing }
        : { ...form };

      const response = await fetch("/api/admin/projects", {
        method: editing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json: unknown = await response.json();

      if (!response.ok || !isRecord(json) || !isProject(json.data)) {
        const message =
          isRecord(json) && typeof json.error === "string"
            ? json.error
            : "Không thể lưu dự án.";

        throw new Error(message);
      }

      const project = json.data;

      const galleryResponse = await fetch(
        `/api/admin/projects/${project.id}/images`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            images: gallery.filter(Boolean),
          }),
        },
      );

      if (!galleryResponse.ok) {
        setMsg("Đã lưu dự án nhưng chưa lưu được gallery.");
      } else {
        setMsg("Đã lưu dự án thành công.");
      }

      await load();

      setEditing(project.id);
      edit(project);
    } catch (error: unknown) {
      console.error("Save project error:", error);

      setMsg(
        error instanceof Error
          ? error.message
          : "Không thể lưu dự án.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string): Promise<void> {
    if (!window.confirm("Bạn có chắc muốn xóa dự án này không?")) {
      return;
    }

    try {
      const response = await fetch("/api/admin/projects", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const json: unknown = await response.json();

      if (!response.ok) {
        const message =
          isRecord(json) && typeof json.error === "string"
            ? json.error
            : "Không thể xóa dự án.";

        throw new Error(message);
      }

      setItems((current) =>
        current.filter((project) => project.id !== id),
      );

      if (editing === id) {
        reset();
      }

      setMsg("Đã xóa dự án.");
    } catch (error: unknown) {
      console.error("Delete project error:", error);

      setMsg(
        error instanceof Error
          ? error.message
          : "Không thể xóa dự án.",
      );
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1250px]">
      <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="section-label">Showcase</div>

          <h1 className="heading-display mt-2 text-3xl font-extrabold tracking-[-.045em] md:text-4xl">
            Dự án
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#718078]">
            Quản lý nội dung, ảnh cover và gallery của từng dự án.
          </p>
        </div>

        <Button type="button" onClick={reset}>
          Tạo dự án
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[.72fr_1.28fr]">
        <div className="rounded-[22px] border border-[#dfe8e2] bg-white p-3 shadow-[0_8px_24px_rgba(20,35,27,.035)]">
          <div className="space-y-2">
            {loading ? (
              <div className="p-8 text-center text-sm text-[#718078]">
                Đang tải dự án...
              </div>
            ) : items.length ? (
              items.map((project) => (
                <div
                  key={project.id}
                  className={`flex gap-3 rounded-xl border p-3 transition ${
                    editing === project.id
                      ? "border-[#b9d7c3] bg-[#f5fbf7]"
                      : "border-[#e8eee9]"
                  }`}
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-[#edf3ef]">
                    {project.cover_image_path ? (
                      <Image
                        src={getSupabaseBrowserUrl(
                          "project-images",
                          project.cover_image_path,
                        )}
                        alt={project.title_vi || "Project image"}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-[10px] font-bold text-[#849188]">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-extrabold text-[#173826]">
                      {project.title_vi}
                    </div>

                    <div className="mt-1 text-xs text-[#7b8981]">
                      {project.location || "Chưa có địa điểm"}
                      {project.year ? ` · ${project.year}` : ""}
                    </div>

                    <div className="mt-2 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 px-3 text-xs"
                        onClick={() => edit(project)}
                      >
                        Sửa
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        className="h-8 px-3 text-xs text-[#a13b3b]"
                        onClick={() => void remove(project.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-[#718078]">
                Chưa có dự án.
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={save}
          className="space-y-5 rounded-[22px] border border-[#dfe8e2] bg-white p-5 shadow-[0_8px_24px_rgba(20,35,27,.035)] md:p-7"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-black">
                {editing ? "Chỉnh sửa dự án" : "Tạo dự án"}
              </h2>

              <p className="mt-1 text-xs text-[#8a978f]">
                Thông tin + cover + gallery.
              </p>
            </div>

            {editing && (
              <button
                type="button"
                onClick={reset}
                className="text-xs font-bold text-[#087a3a]"
              >
                Mới
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              value={form.slug}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  slug: event.target.value,
                }))
              }
              placeholder="slug"
              required
            />

            <Input
              value={form.location}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  location: event.target.value,
                }))
              }
              placeholder="Location"
            />

            <Input
              value={form.title_vi}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title_vi: event.target.value,
                }))
              }
              placeholder="Tên dự án VI"
              required
            />

            <Input
              value={form.title_en}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title_en: event.target.value,
                }))
              }
              placeholder="Project title EN"
            />

            <Input
              type="number"
              value={form.year ?? ""}
              onChange={(event) => {
                const value = event.target.value.trim();

                setForm((current) => ({
                  ...current,
                  year:
                    value === ""
                      ? null
                      : Number(value),
                }));
              }}
              placeholder="Year"
            />

            <label className="flex items-center gap-2 rounded-xl border border-[#d9e4dd] px-3 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    published: event.target.checked,
                  }))
                }
              />

              Published
            </label>
          </div>

          <textarea
            value={form.description_vi}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description_vi: event.target.value,
              }))
            }
            placeholder="Mô tả VI"
            className="min-h-28 w-full rounded-xl border border-[#d9e4dd] p-3.5 text-sm outline-none focus:border-[#11823b] focus:ring-4 focus:ring-[#edf8f1]"
          />

          <textarea
            value={form.description_en}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description_en: event.target.value,
              }))
            }
            placeholder="Description EN"
            className="min-h-28 w-full rounded-xl border border-[#d9e4dd] p-3.5 text-sm outline-none focus:border-[#11823b] focus:ring-4 focus:ring-[#edf8f1]"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <textarea
              value={form.equipment_vi}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  equipment_vi: event.target.value,
                }))
              }
              placeholder="Thiết bị / vật tư VI"
              className="min-h-24 w-full rounded-xl border border-[#d9e4dd] p-3.5 text-sm outline-none focus:border-[#11823b] focus:ring-4 focus:ring-[#edf8f1]"
            />

            <textarea
              value={form.equipment_en}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  equipment_en: event.target.value,
                }))
              }
              placeholder="Equipment EN"
              className="min-h-24 w-full rounded-xl border border-[#d9e4dd] p-3.5 text-sm outline-none focus:border-[#11823b] focus:ring-4 focus:ring-[#edf8f1]"
            />

            <textarea
              value={form.scope_vi}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  scope_vi: event.target.value,
                }))
              }
              placeholder="Phạm vi VI"
              className="min-h-24 w-full rounded-xl border border-[#d9e4dd] p-3.5 text-sm outline-none focus:border-[#11823b] focus:ring-4 focus:ring-[#edf8f1]"
            />

            <textarea
              value={form.scope_en}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  scope_en: event.target.value,
                }))
              }
              placeholder="Scope EN"
              className="min-h-24 w-full rounded-xl border border-[#d9e4dd] p-3.5 text-sm outline-none focus:border-[#11823b] focus:ring-4 focus:ring-[#edf8f1]"
            />
          </div>

          <ImageUploader
            value={form.cover_image_path}
            bucket_id ="project-images"
            folder="projects/covers"
            label="Ảnh cover"
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                cover_image_path: value,
              }))
            }
          />

          <div>
            <div className="mb-2 text-sm font-extrabold text-[#24392d]">
              Gallery dự án
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {gallery.map((imagePath, index) => (
                <div
                  key={`${imagePath || "empty"}-${index}`}
                  className="rounded-2xl border border-[#e1e9e4] bg-[#f8fbf9] p-3"
                >
                  <ImageUploader
                    value={imagePath}
                    bucket_id ="project-images"
                    folder="projects/gallery"
                    label={`Ảnh ${index + 1}`}
                    onChange={(value) =>
                      setGallery((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index
                            ? value
                            : item,
                        ),
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setGallery((current) =>
                        current.filter(
                          (_, itemIndex) =>
                            itemIndex !== index,
                        ),
                      )
                    }
                    className="mt-2 text-xs font-bold text-[#a13b3b] hover:underline"
                  >
                    Xóa ảnh
                  </button>
                </div>
              ))}

              {gallery.length < 8 && (
                <button
                  type="button"
                  onClick={() =>
                    setGallery((current) => [
                      ...current,
                      "",
                    ])
                  }
                  className="min-h-44 rounded-2xl border border-dashed border-[#cbd9cf] bg-[#f8fbf9] text-sm font-extrabold text-[#087a3a] transition hover:border-[#8ebda0] hover:bg-[#f1f8f3]"
                >
                  + Thêm ảnh gallery
                </button>
              )}
            </div>
          </div>

          {msg && (
            <div className="rounded-xl border border-[#dfe8e2] bg-[#f7faf8] px-4 py-3 text-sm text-[#246d43]">
              {msg}
            </div>
          )}

          <Button type="submit" disabled={saving}>
            {saving ? "Đang lưu…" : "Lưu dự án"}
          </Button>
        </form>
      </div>
    </div>
  );
}