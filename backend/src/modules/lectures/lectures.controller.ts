import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { CreateLectureDto } from './dto/create-lecture.dto';

@Controller('lectures')
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  @Post()
  create(@Body() createLectureDto: CreateLectureDto) {
    return this.lecturesService.create(createLectureDto);
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.lecturesService.findByCourse(courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lecturesService.findOne(id);
  }

  @Put('swap/:lectureId1/:lectureId2')
  async swapLectures(
    @Param('lectureId1') lectureId1: string,
    @Param('lectureId2') lectureId2: string,
  ) {
    return this.lecturesService.swapOrder(lectureId1, lectureId2);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateLectureDto: CreateLectureDto) {
    return this.lecturesService.update(id, updateLectureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lecturesService.remove(id);
  }
}
