import { http } from '@/config/api';
import { IUserModel } from '@/interface/redux/user.interface';
import { updateUser } from '@/redux/reducers/auth';

export default class UserModel implements IUserModel {
  id: number = 0;
  firstName: string = '';
  lastName: string = '';
  phone: string = '';
  telegramId?: number;
  telegramUsername?: string;
  password: string = '';
  smsToken: string = '';
  role: string = '';
  vehicleSearchLimit: number = 6;
  loadSearchLimit: number = 30;
  newLoadsNotifierEnabled: boolean = false;
  hasPassword: boolean = false;
  bookmarkedLoadIds: string[] = [];
  bookmarkedVehicleIds: string[] = [];
  markedExpiredLoads: string[] = [];
  markedInvalidVehicles: string[] = [];
  isSubscriptionModal: boolean = false;

  constructor(data: Partial<IUserModel>) {
    Object.assign(this, data);
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.phone = data.phone || '';
    this.password = data.password || '';
    this.smsToken = data.smsToken || '';
    this.role = data.role || '';
  }

  get fullName(): string {
    return `${this.firstName || 'User'} ${this.lastName || ''}`.trim();
  }

  // Foydalanuvchining obunasini tekshirish
  async hasActiveSubscription(): Promise<boolean> {
    try {
      const response = await http.get<{ active: boolean }>(`users/has-subscription`);
      return response.data.active;
    } catch (error) {
      console.error('Error checking subscription:', error);
      throw new Error('Unable to check subscription');
    }
  }

  // Parolni o'zgartirish funksiyasi
  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    try {
      await http.post(`users/change-password`, data);
    } catch (error) {
      console.error('Error changing password:', error);
      throw new Error('Unable to change password');
    }
  }

  async save(dispatch: any) {
    await dispatch(updateUser(this))
  }
}
