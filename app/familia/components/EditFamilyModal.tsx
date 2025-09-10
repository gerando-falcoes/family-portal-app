'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { FamilyForm } from "./FamilyForm"
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
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Editar Informações da Família</DialogTitle>
          <DialogDescription>
            Altere os dados abaixo e clique em salvar. As informações serão atualizadas para toda a equipe.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <FamilyForm 
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
