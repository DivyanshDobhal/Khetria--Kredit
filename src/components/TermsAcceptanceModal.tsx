import React from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TermsAcceptanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  accepted: boolean;
  setAccepted: (accepted: boolean) => void;
}

const TermsAcceptanceModal: React.FC<TermsAcceptanceModalProps> = ({
  open,
  onOpenChange,
  onAccept,
  accepted,
  setAccepted,
}) => {
  const { language } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {language === 'hi' ? 'नियम और शर्तें स्वीकार करें' : 'Accept Terms & Conditions'}
          </DialogTitle>
          <DialogDescription>
            {language === 'hi'
              ? 'आगे बढ़ने से पहले, कृपया हमारे नियमों और शर्तों को पढ़ें और स्वीकार करें।'
              : 'Before proceeding, please read and accept our Terms & Conditions.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start space-x-2 pt-4">
          <Checkbox
            id="terms"
            checked={accepted}
            onCheckedChange={(checked) => setAccepted(checked as boolean)}
            className="mt-1"
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {language === 'hi'
                ? 'मैंने नियम और शर्तें पढ़ ली हैं और सहमत हूँ।'
                : 'I have read and agree to the Terms & Conditions.'}
            </Label>
            <p className="text-sm text-muted-foreground">
              <Link
                to="/terms-and-conditions"
                target="_blank"
                className="text-primary hover:underline"
                onClick={() => onOpenChange(false)}
              >
                {language === 'hi' ? 'नियम और शर्तें देखें' : 'View Terms & Conditions'}
              </Link>
            </p>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {language === 'hi' ? 'रद्द करें' : 'Cancel'}
          </Button>
          <Button
            type="submit"
            disabled={!accepted}
            onClick={onAccept}
          >
            {language === 'hi' ? 'स्वीकार करें' : 'Accept'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsAcceptanceModal;