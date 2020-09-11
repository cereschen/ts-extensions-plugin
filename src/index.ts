import tss from "typescript/lib/tsserverlibrary";
import { makeCreate } from './create';

export = (mod: { typescript: typeof tss }) => {
  const create = makeCreate(mod);
  return { create };
};