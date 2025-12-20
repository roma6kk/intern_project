import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountService } from './account.service';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':id')
  findByUser(@Param('id') userId: string) {
    return this.accountService.findByUser(userId);
  }

  @Patch(':id')
  update(
    @Param('id') userId: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountService.updateByUserId(userId, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') userId: string) {
    return this.accountService.removeByUser(userId);
  }
}
