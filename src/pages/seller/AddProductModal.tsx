
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProducts } from '../../context/ProductContext';
import { toast } from 'sonner';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  keywords: string;
  imageUrl: string;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { addProduct } = useProducts();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>();

  const onSubmit = async (data: ProductFormData) => {
    try {
      await addProduct({
        title: data.title,
        description: data.description,
        price: Number(data.price),
        keywords: data.keywords.split(',').map(k => k.trim()),
        imageUrl: data.imageUrl,
      });
      toast.success('Produit ajouté !');
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Erreur lors de l'ajout du produit");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un Nouveau Produit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              {...register('title', { required: 'Le titre est obligatoire' })}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description', { required: 'La description est obligatoire' })}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Prix</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register('price', {
                required: 'Le prix est obligatoire',
                min: { value: 0, message: 'Le prix doit être positif' }
              })}
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Mots-clés (séparés par des virgules)</Label>
            <Input
              id="keywords"
              {...register('keywords', { required: 'Au moins un mot-clé est requis' })}
              placeholder="ex: électronique, gadget, nouveau"
            />
            {errors.keywords && (
              <p className="text-sm text-destructive">{errors.keywords.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL de l'image</Label>
            <Input
              id="imageUrl"
              {...register('imageUrl', { required: "L'URL de l'image est obligatoire" })}
            />
            {errors.imageUrl && (
              <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">Ajouter le Produit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
