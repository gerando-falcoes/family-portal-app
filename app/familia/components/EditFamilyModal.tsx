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
      <DialogContent className="max-w-6xl h-[90vh] bg-white border-0 shadow-2xl rounded-2xl p-0 flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-2xl flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Edit className="w-5 h-5 text-white" />
              </div>
              Editar Informações da Família
            </DialogTitle>
            <DialogDescription className="text-blue-100 mt-2 text-sm">
              Altere os dados abaixo e clique em salvar. O email não pode ser alterado por questões de segurança.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="flex-1 overflow-y-auto">
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
