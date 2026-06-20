import type { TagRefNode_Data, TagRefNode_Tag } from "@src/client/util/tag/type/refnode";

export const tag_refnode_normalize = function(refnodes: readonly TagRefNode_Data[]): TagRefNode_Tag[] {
    const hashmap = new Set<string>()
    const tagnodes: TagRefNode_Tag[] = []

    for (const refnode of refnodes) {
        if (refnode.deleted === 1) {
            continue
        }

        const tagnode = refnode.tag

        if (tagnode === null || tagnode.deleted === 1) {
            continue
        }

        if (hashmap.has(tagnode.id)) {
            continue
        }

        {
            hashmap.add(tagnode.id)

            tagnodes.push(tagnode)
        }
    }

    return tagnodes
}
