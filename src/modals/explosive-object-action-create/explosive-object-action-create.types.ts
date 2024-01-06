import { IExplosiveObjectActionValueParams } from '~/stores'

export type IExplosiveObjectActionForm = Omit<IExplosiveObjectActionValueParams, "documentType" | "documentId">