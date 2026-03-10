import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { AccountService } from './account.service';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Accounts')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @ApiOperation({ summary: 'Get all accounts' })
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account by user ID' })
  findByUser(@Param('id') userId: string) {
    return this.accountService.findByUser(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update account by user ID' })
  update(
    @Param('id') userId: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountService.updateByUserId(userId, updateAccountDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete account by user ID' })
  remove(@Param('id') userId: string) {
    return this.accountService.removeByUser(userId);
  }
}
