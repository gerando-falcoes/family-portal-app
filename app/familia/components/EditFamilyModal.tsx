'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Edit } from "lucide-react"
import { EditFamilyForm } from "./EditFamilyForm"
import type { Family } from "@/lib/types"

interface EditFamilyModalProps {
  family: Family | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedData: Partial<Family>) => void
  isLoading: boolean
}

export function EditFamilyModal({ family, isOpen, onClose, onSave, isLoading }: EditFamilyModalProps) {
  if (!family) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl rounded-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 -m-6 mb-8 p-6 rounded-t-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Edit className="w-6 h-6 text-white" />
              </div>
              Editar Informações da Família
            </DialogTitle>
            <DialogDescription className="text-blue-100 mt-3 text-base">
              Altere os dados abaixo e clique em salvar. O email não pode ser alterado por questões de segurança.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="px-1">
          <EditFamilyForm 
            family={family} 
            onSave={onSave} 
            onCancel={onClose} 
            isLoading={isLoading} 
          />
        </div>

      </DialogContent>
    </Dialog>
  )
}
