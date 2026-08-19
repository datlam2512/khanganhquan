"use client";

import type { SpecGroup } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type MaterialGroup = {
  name: string;
  items: string[];
};

type TextSpecGroup = {
  id: string;
  type: "text";
  title: string;
  content: string;
};

type MaterialSpecGroup = {
  id: string;
  type: "material";
  title: string;
  groups: MaterialGroup[];
};

type BuilderSpecGroup =
  | TextSpecGroup
  | MaterialSpecGroup;

type SpecGroupBuilderProps = {
  value: SpecGroup[];
  onChange: (value: SpecGroup[]) => void;
  language?: "vi" | "en";
};

function createId(prefix = "spec") {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function normalizeGroups(
  value: SpecGroup[],
): BuilderSpecGroup[] {
  return value.map((item, index) => {
    const current = item as Record<
      string,
      unknown
    >;

    if (current.type === "material") {
      return {
        id:
          typeof current.id === "string"
            ? current.id
            : `material-${index}`,

        type: "material",

        title:
          typeof current.title === "string"
            ? current.title
            : "",

        groups:
          Array.isArray(current.groups)
            ? current.groups.map(
                (group) => {
                  const g =
                    group as Record<
                      string,
                      unknown
                    >;

                  return {
                    name:
                      typeof g.name === "string"
                        ? g.name
                        : "",

                    items:
                      Array.isArray(g.items)
                        ? g.items.filter(
                            (item): item is string =>
                              typeof item ===
                              "string",
                          )
                        : [],
                  };
                },
              )
            : [],
      };
    }

    return {
      id:
        typeof current.id === "string"
          ? current.id
          : `text-${index}`,

      type: "text",

      title:
        typeof current.title === "string"
          ? current.title
          : "",

      content:
        typeof current.content === "string"
          ? current.content
          : "",
    };
  });
}

export function SpecGroupBuilder({
  value,
  onChange,
  language = "vi",
}: SpecGroupBuilderProps) {
  const groups = normalizeGroups(value);

  const title =
    language === "vi"
      ? "Thông số kỹ thuật"
      : "Specifications";

  const addTextGroup = () => {
    const newGroup: TextSpecGroup = {
      id: createId("text"),
      type: "text",
      title: "",
      content: "",
    };

    onChange([
      ...groups,
      newGroup,
    ] as SpecGroup[]);
  };

  const addMaterialGroup = () => {
    const newGroup: MaterialSpecGroup = {
      id: createId("material"),
      type: "material",
      title: "",
      groups: [],
    };

    onChange([
      ...groups,
      newGroup,
    ] as SpecGroup[]);
  };

  const updateGroup = (
    index: number,
    updated: BuilderSpecGroup,
  ) => {
    const next = [...groups];

    next[index] = updated;

    onChange(
      next as SpecGroup[],
    );
  };

  const removeGroup = (
    index: number,
  ) => {
    onChange(
      groups.filter(
        (_, i) => i !== index,
      ) as SpecGroup[],
    );
  };

  const addMaterialSubGroup = (
    index: number,
  ) => {
    const group = groups[index];

    if (
      group.type !== "material"
    ) {
      return;
    }

    updateGroup(index, {
      ...group,

      groups: [
        ...group.groups,
        {
          name: "",
          items: [],
        },
      ],
    });
  };

  const updateMaterialSubGroup = (
    specIndex: number,
    materialIndex: number,
    updated: MaterialGroup,
  ) => {
    const group =
      groups[specIndex];

    if (
      group.type !== "material"
    ) {
      return;
    }

    const nextMaterials = [
      ...group.groups,
    ];

    nextMaterials[
      materialIndex
    ] = updated;

    updateGroup(
      specIndex,
      {
        ...group,
        groups: nextMaterials,
      },
    );
  };

  const removeMaterialSubGroup = (
    specIndex: number,
    materialIndex: number,
  ) => {
    const group =
      groups[specIndex];

    if (
      group.type !== "material"
    ) {
      return;
    }

    updateGroup(
      specIndex,
      {
        ...group,

        groups:
          group.groups.filter(
            (_, i) =>
              i !== materialIndex,
          ),
      },
    );
  };

  const addMaterialItem = (
    specIndex: number,
    materialIndex: number,
  ) => {
    const group =
      groups[specIndex];

    if (
      group.type !== "material"
    ) {
      return;
    }

    const material =
      group.groups[
        materialIndex
      ];

    const updatedMaterial = {
      ...material,

      items: [
        ...material.items,
        "",
      ],
    };

    updateMaterialSubGroup(
      specIndex,
      materialIndex,
      updatedMaterial,
    );
  };

  const updateMaterialItem = (
    specIndex: number,
    materialIndex: number,
    itemIndex: number,
    value: string,
  ) => {
    const group =
      groups[specIndex];

    if (
      group.type !== "material"
    ) {
      return;
    }

    const material =
      group.groups[
        materialIndex
      ];

    const items = [
      ...material.items,
    ];

    items[itemIndex] = value;

    updateMaterialSubGroup(
      specIndex,
      materialIndex,
      {
        ...material,
        items,
      },
    );
  };

  const removeMaterialItem = (
    specIndex: number,
    materialIndex: number,
    itemIndex: number,
  ) => {
    const group =
      groups[specIndex];

    if (
      group.type !== "material"
    ) {
      return;
    }

    const material =
      group.groups[
        materialIndex
      ];

    updateMaterialSubGroup(
      specIndex,
      materialIndex,
      {
        ...material,

        items:
          material.items.filter(
            (_, i) =>
              i !== itemIndex,
          ),
      },
    );
  };

  return (
    <div className="space-y-5">
      {/* HEADER */}

      <div className="flex flex-col gap-3 rounded-2xl border border-[#dfe8e2] bg-[#f8fbf9] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-extrabold text-[#18251d]">
            {title}
          </div>

          <div className="mt-1 text-xs leading-5 text-[#829087]">
            Thêm các thông số mà không cần nhập JSON.
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={addTextGroup}
          >
            + Thông số text
          </Button>

          <Button
            type="button"
            onClick={addMaterialGroup}
          >
            + Vật liệu
          </Button>
        </div>
      </div>

      {/* EMPTY */}

      {groups.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#cbd8d0] bg-[#fbfcfb] p-8 text-center">
          <div className="text-sm font-semibold text-[#59675f]">
            Chưa có thông số
          </div>

          <div className="mt-1 text-xs text-[#8b9790]">
            Bấm &quot;Thông số text&quot; hoặc &quot;Vật liệu&quot; để bắt đầu.
          </div>
        </div>
      )}

      {/* GROUPS */}

      {groups.map(
        (group, index) => (
          <div
            key={group.id}
            className="rounded-2xl border border-[#dfe8e2] bg-white p-4 shadow-sm"
          >
            {/* GROUP HEADER */}

            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-[#eaf7ef] px-2.5 py-1 text-xs font-bold text-[#1a5a36]">
                  {index + 1}
                </span>

                <span className="text-sm font-extrabold text-[#18251d]">
                  {group.type ===
                  "material"
                    ? "Thông số vật liệu"
                    : "Thông số text"}
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  removeGroup(index)
                }
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                Xóa
              </Button>
            </div>

            {/* TITLE */}

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#59675f]">
                Tiêu đề
              </label>

              <Input
                placeholder={
                  language === "vi"
                    ? "Ví dụ: Tiêu chuẩn"
                    : "Example: Standards"
                }
                value={group.title}
                onChange={(event) => {
                  updateGroup(
                    index,
                    {
                      ...group,
                      title:
                        event.target
                          .value,
                    },
                  );
                }}
              />
            </div>

            {/* TEXT */}

            {group.type ===
              "text" && (
              <div className="mt-4 space-y-2">
                <label className="text-xs font-bold text-[#59675f]">
                  Nội dung
                </label>

                <textarea
                  value={
                    group.content
                  }
                  onChange={(
                    event,
                  ) => {
                    updateGroup(
                      index,
                      {
                        ...group,
                        content:
                          event.target
                            .value,
                      },
                    );
                  }}
                  placeholder={
                    language === "vi"
                      ? "Nhập nội dung thông số..."
                      : "Enter specification content..."
                  }
                  className="min-h-28 w-full rounded-xl border border-[#d9e4dd] bg-[#fbfcfb] p-3.5 text-sm outline-none transition focus:border-[#86c69a] focus:bg-white focus:ring-4 focus:ring-[#eaf7ef]"
                />
              </div>
            )}

            {/* MATERIAL */}

            {group.type ===
              "material" && (
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-extrabold text-[#59675f]">
                      Nhóm vật liệu
                    </div>

                    <div className="mt-1 text-[11px] text-[#8b9790]">
                      Ví dụ: Carbon Steel, Duplex...
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      addMaterialSubGroup(
                        index,
                      )
                    }
                  >
                    + Thêm nhóm
                  </Button>
                </div>

                {group.groups.length ===
                  0 && (
                  <div className="rounded-xl border border-dashed border-[#cbd8d0] p-5 text-center text-xs text-[#829087]">
                    Chưa có nhóm vật liệu.
                  </div>
                )}

                {group.groups.map(
                  (
                    material,
                    materialIndex,
                  ) => (
                    <div
                      key={`${group.id}-material-${materialIndex}`}
                      className="rounded-xl border border-[#e5ece7] bg-[#fafcfb] p-4"
                    >
                      {/* MATERIAL NAME */}

                      <div className="flex gap-2">
                        <Input
                          placeholder={
                            language ===
                            "vi"
                              ? "Tên nhóm: Carbon Steel"
                              : "Group name: Carbon Steel"
                          }
                          value={
                            material.name
                          }
                          onChange={(
                            event,
                          ) => {
                            updateMaterialSubGroup(
                              index,
                              materialIndex,
                              {
                                ...material,
                                name:
                                  event
                                    .target
                                    .value,
                              },
                            );
                          }}
                        />

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            removeMaterialSubGroup(
                              index,
                              materialIndex,
                            )
                          }
                          className="shrink-0 border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Xóa
                        </Button>
                      </div>

                      {/* ITEMS */}

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-[#59675f]">
                            Danh sách vật liệu
                          </label>

                          <button
                            type="button"
                            onClick={() =>
                              addMaterialItem(
                                index,
                                materialIndex,
                              )
                            }
                            className="text-xs font-bold text-[#1a5a36] hover:underline"
                          >
                            + Thêm item
                          </button>
                        </div>

                        {material.items.map(
                          (
                            item,
                            itemIndex,
                          ) => (
                            <div
                              key={`${group.id}-${materialIndex}-${itemIndex}`}
                              className="flex gap-2"
                            >
                              <Input
                                placeholder="Ví dụ: A106B"
                                value={
                                  item
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateMaterialItem(
                                    index,
                                    materialIndex,
                                    itemIndex,
                                    event
                                      .target
                                      .value,
                                  )
                                }
                              />

                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  removeMaterialItem(
                                    index,
                                    materialIndex,
                                    itemIndex,
                                  )
                                }
                                className="shrink-0 border-red-200 px-3 text-red-600 hover:bg-red-50"
                              >
                                ×
                              </Button>
                            </div>
                          ),
                        )}

                        {material.items
                          .length ===
                          0 && (
                          <div className="rounded-lg border border-dashed border-[#d6e1da] p-3 text-center text-xs text-[#8b9790]">
                            Chưa có vật liệu.
                            Bấm &quot;+ Thêm item&quot;.
                          </div>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        ),
      )}

      {/* ADD */}

      {groups.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={addTextGroup}
          >
            + Thêm thông số text
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={addMaterialGroup}
          >
            + Thêm thông số vật liệu
          </Button>
        </div>
      )}
    </div>
  );
}