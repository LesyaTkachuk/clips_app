import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modals: IModal[] = [];

  constructor() {}

  register(id: string) {
    this.modals.push({
      id,
      visible: false,
    });
  }

  unregister(id: string) {
    this.modals.filter((modal) => modal.id !== id);
  }

  isModalVisible(id: string): boolean {
    return !!this.modals.find((element) => id === element.id)?.visible;
  }

  toggleModal(id: string) {
    const currentModal = this.modals.find((element) => id === element.id);

    if (currentModal) {
      currentModal.visible = !currentModal.visible;
    }
  }
}
